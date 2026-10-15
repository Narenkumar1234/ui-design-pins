import sys,subprocess,json,re,os
T=["All","Beaches","4.8","4.9","Kyoto, Japan","Kyoto","Trending","$899","Nearby escapes","Top Facilities","Fast Wi-Fi","Wi-Fi","Book Now","Lago di Braies","Popular trips","Home","Explore","Featured places","$1,250","Search destinations"]
js="""<script>setTimeout(function(){var T=%s,out={};document.querySelectorAll('body *').forEach(function(e){var t=(e.textContent||'').trim();if(T.indexOf(t)>=0&&!out[t]){var r=e.getBoundingClientRect();if(r.width>0)out[t]=[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)];}});
['input'].forEach(function(s){var e=document.querySelector(s);if(e){var r=e.getBoundingClientRect();out['input']=[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]}});
out.W=innerWidth;out.H=innerHeight;document.title='M'+JSON.stringify(out);var p=document.createElement('pre');p.id='MEAS';p.textContent=JSON.stringify(out);document.body.appendChild(p);},2500)</script>"""%json.dumps(T)
for f in sys.argv[1:]:
    s=open(f).read().replace('</body>',js+'</body>'); open('/tmp/_m.html','w').write(s.replace('../img/','file://'+os.path.abspath('../img')+'/'))
    r=subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--window-size=390,800','--force-device-scale-factor=2','--hide-scrollbars','--virtual-time-budget=6000','--dump-dom','file:///tmp/_m.html'],capture_output=True,text=True).stdout
    m=re.search(r'<pre id="MEAS">(.*?)</pre>',r); print(f,m.group(1) if m else 'NONE')
