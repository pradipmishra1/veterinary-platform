from moviepy import VideoFileClip
from PIL import Image, ImageDraw
from pathlib import Path
clip=VideoFileClip('brag-output/brag.mp4')
root=Path('brag-output/work'); times=[0.0,4.8,8.8,12.8,16.8]
thumbs=[]
for i,t in enumerate(times,1):
 im=Image.fromarray(clip.get_frame(t)).convert('RGB'); im.save(root/f'final-scene-{i}.jpg',quality=96)
 im.thumbnail((640,360)); thumbs.append((im,t))
contact=Image.new('RGB',(1280,780),'#0b3329'); d=ImageDraw.Draw(contact)
for i,(im,t) in enumerate(thumbs):
 x=(i%2)*640; y=(i//2)*390+24; contact.paste(im,(x,y)); d.text((x+14,y-20),f'{t:.1f}s',fill='white')
contact.save(root/'final-scenes-contact.jpg',quality=95)
first=Image.fromarray(clip.get_frame(0)).convert('RGB')
poster=Image.open('brag-output/brag.jpg').convert('RGB')
import numpy as np
arr=np.asarray(first,dtype=np.int16)-np.asarray(poster,dtype=np.int16)
print({'frame0_vs_poster_mean_abs_rgb':round(float(np.abs(arr).mean()),3),'scene_stills':len(times)})
clip.close()
