"""Build /workspace/products/e-learning-ui-kit.zip (README, LICENSE, code/, design/; skips _* and dotfiles)."""
import os, zipfile
os.chdir('/workspace/products'); out='e-learning-ui-kit.zip'
if os.path.exists(out): os.remove(out)
n=0
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for top in ['README.md','LICENSE.txt','code','design']:
        p='e-learning-ui-kit/'+top
        files=[p] if os.path.isfile(p) else [os.path.join(r,f) for r,ds,fs in os.walk(p) for f in fs]
        for f in sorted(files):
            if any(part.startswith(('_','.')) for part in f.split('/')[1:]): continue
            z.write(f); n+=1
print(n,'files',os.path.getsize(out),'bytes')
