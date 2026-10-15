import sys
from PIL import Image
fs=['light-home','light-explore','light-detail','dark-home','dark-explore','dark-detail']
ims=[Image.open(f+'.png').convert('RGB').resize((390,800)) for f in fs]
S=Image.new('RGB',(390*3+20,1610),'#888')
for k,i in enumerate(ims): S.paste(i,((k%3)*400,(k//3)*810))
S.save(sys.argv[1])
