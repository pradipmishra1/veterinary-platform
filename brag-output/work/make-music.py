import numpy as np, wave
from pathlib import Path
sr=48000; dur=20.0; n=int(sr*dur); t=np.arange(n,dtype=np.float64)/sr
L=np.zeros(n); R=np.zeros(n)
chords=[[98.00,146.83,196.00,246.94,293.66],[130.81,196.00,246.94,329.63,392.00],[82.41,123.47,146.83,196.00,246.94],[146.83,196.00,220.00,293.66,369.99],[98.00,146.83,196.00,246.94,293.66]]
# Airy, sustained tones; each harmony eases between four-second scenes.
for i,ch in enumerate(chords):
 a=i*4; b=min(dur,a+4.35); ix=(t>=a)&(t<b); local=t[ix]-a
 env=np.ones(local.size)
 env*=np.minimum(1,np.maximum(0,local/0.55))
 if i>0: env*=np.minimum(1,np.maximum(0,(local+0.4)/0.4))
 env*=np.minimum(1,np.maximum(0,(b-t[ix])/0.7))
 for j,f in enumerate(ch):
  tone=np.sin(2*np.pi*f*t[ix]) + 0.20*np.sin(2*np.pi*2*f*t[ix]+.2)
  amp=(0.011 if j<3 else 0.008)/np.sqrt(1+j*.3)
  L[ix]+=amp*tone*env; R[ix]+=amp*tone*env
# Warm, soft mallet notes in the same G major palette.
notes=[392.00,493.88,587.33,493.88,440.00,392.00,329.63,392.00]
for k,start in enumerate(np.arange(.45,19.5,.75)):
 f=notes[k%len(notes)]; ix=(t>=start)&(t<start+.50); u=t[ix]-start
 env=(1-np.exp(-u*75))*np.exp(-u*8.2)
 hit=(np.sin(2*np.pi*f*u)+.21*np.sin(2*np.pi*f*2.01*u))*env*.035
 L[ix]+=hit; R[ix]+=hit*.97
# Low, rounded pulse every other beat; kept well below the melody.
for start in np.arange(.0,20,.96):
 ix=(t>=start)&(t<start+.26); u=t[ix]-start
 freq=72-18*np.minimum(u/.26,1)
 phase=2*np.pi*(72*u-9*u*u/.26)
 kick=np.sin(phase)*np.exp(-u*18)*.042
 L[ix]+=kick; R[ix]+=kick
# Soft same-key cues are integrated as notes, not sharp overlays.
for start,f in [(3.72,587.33),(7.72,493.88),(11.72,587.33),(15.72,493.88)]:
 ix=(t>=start)&(t<start+.32); u=t[ix]-start
 cue=np.sin(2*np.pi*f*u)*np.exp(-u*10)*.028
 L[ix]+=cue; R[ix]+=cue*.97
# Very short fade in/out, stereo room smear, conservative headroom.
f_in=np.minimum(1,t/.9); f_out=np.minimum(1,(dur-t)/1.15)
fader=np.clip(np.minimum(f_in,f_out),0,1)
for arr in (L,R): arr*=fader
peak=max(np.max(np.abs(L)),np.max(np.abs(R)))
gain=.72/max(peak,1e-8)
st=np.stack([L*gain,R*gain],axis=1)
st=np.clip(st,-.98,.98)
pcm=(st*32767).astype('<i2')
out=Path('brag-output/work/music.wav')
with wave.open(str(out),'wb') as w:
 w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
print('Wrote',out,'peak',round(float(np.max(np.abs(st))),3),'seconds',dur)
