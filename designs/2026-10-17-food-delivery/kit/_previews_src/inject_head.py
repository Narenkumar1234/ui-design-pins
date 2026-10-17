"""Dev helper: inlines _previews_src/_head.txt into every code/*.html at <!--HEAD--> (run once after editing pages)."""
import glob,os
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','code')
H=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'_head.txt')).read().rstrip('\n')
for f in glob.glob(os.path.join(C,'*.html')):
    s=open(f).read()
    if '<!--HEAD-->' in s: open(f,'w').write(s.replace('<!--HEAD-->',H)); print('head ->',os.path.basename(f))
