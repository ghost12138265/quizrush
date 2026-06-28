'use client';

import { CharacterEmotion } from '@/types';

interface CharacterProps {
  stage: number;
  emotion: CharacterEmotion;
  animating: boolean;
}

/* ===================================================================
   颜色定数 — 低饱和马卡龙配色
   =================================================================== */
const C = {
  bgDeep:  '#062025',
  bgEdge:  '#072227',
  cyan:    '#22d8ee',
  white:   '#f8f8fa',
  black:   '#1a1a1a',
  hoodBlush:'#f9d3d3',
  hair:    '#e2d8e0',
  hairTip: '#d4c8dd',
  clip:    '#d0d2d8',
  skin:    '#fce9e3',
  skinShade:'#f5dbd5',
  blush:   '#f9cbcb',
  eyeBase: '#b8aeb8',
  eyeHi:   '#fcfcfd',
  brow:    '#b8b2bc',
  lip:     '#f8c8d0',
  dress:   '#506078',
  dressShade:'#45556b',
  bowColor:'#f7c2d0',
};

/* ===================================================================
   共用样式工具
   =================================================================== */
const softShadow = '0 2px 6px rgba(0,0,0,0.12)';
const softInner  = 'inset 0 1px 3px rgba(255,255,255,0.25)';

export default function Character({ stage, emotion, animating }: CharacterProps) {
  const animClass = animating ? `anim-${emotion}` : 'anim-idle';

  const isHurt = emotion === 'hurt' || emotion === 'dead';
  const isHappy = emotion === 'happy';

  const mouthW = isHappy ? 13 : isHurt ? 6 : 8;
  const mouthH = isHappy ? 5 : isHurt ? 4 : 4;
  const mouthY = isHappy ? 168 : 171;
  const browTilt = isHurt ? 'rotate(-6deg)' : isHappy ? 'rotate(4deg)' : 'rotate(0deg)';

  const H  = 180;
  const CX = 148;

  return (
    <div
      className={`character-container ${animClass}`}
      style={{
        position: 'relative', display: 'inline-block',
        width: 300, height: H, userSelect: 'none',
      }}
    >

      {/* ================================================================ */}
      {/* 角色主体 — 缩放包裹层                                                */}
      {/* ================================================================ */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%) scale(0.35)',
        transformOrigin: 'top center',
        width: 300, height: H,
      }}>

      {/* ================================================================ */}
      {/* 头发后层                                                          */}
      {/* ================================================================ */}
      {/* 左发 */}
      <div style={{
        position: 'absolute', left: CX-64, top: 106,
        width: 36, height: 64,
        background: `linear-gradient(180deg, ${C.hair} 0%, ${C.hairTip} 85%)`,
        borderRadius: '30% 0 60% 40%', zIndex: 5,
        boxShadow: softShadow,
      }} />
      {/* 右发 */}
      <div style={{
        position: 'absolute', left: CX+28, top: 106,
        width: 36, height: 64,
        background: `linear-gradient(180deg, ${C.hair} 0%, ${C.hairTip} 85%)`,
        borderRadius: '0 30% 40% 60%', zIndex: 5,
        boxShadow: softShadow,
      }} />
      {/* 发梢渐变块 */}
      <div style={{
        position: 'absolute', left: CX-60, top: 154, width: 28, height: 18,
        background: C.hairTip, borderRadius: '0 0 70% 50%', zIndex: 5, opacity: 0.8,
      }} />
      <div style={{
        position: 'absolute', left: CX+32, top: 154, width: 28, height: 18,
        background: C.hairTip, borderRadius: '0 0 50% 70%', zIndex: 5, opacity: 0.8,
      }} />

      {/* ================================================================ */}
      {/* 手臂 — 短短圆润肉感小手                                               */}
      {/* ================================================================ */}
      <div style={{
        position: 'absolute', left: CX-68, top: 196, width: 22, height: 26,
        background: `linear-gradient(90deg, ${C.skinShade}, ${C.skin})`,
        borderRadius: '50% 40% 45% 55%', zIndex: 6, boxShadow: softShadow,
      }} />
      <div style={{
        position: 'absolute', left: CX+46, top: 196, width: 22, height: 26,
        background: `linear-gradient(270deg, ${C.skinShade}, ${C.skin})`,
        borderRadius: '40% 50% 55% 45%', zIndex: 6, boxShadow: softShadow,
      }} />

      {/* ================================================================ */}
      {/* 裙身 — 藏青灰宽松娃娃连衣裙 + 柔和阴影                                */}
      {/* ================================================================ */}
      <div style={{
        position: 'absolute', left: CX-52, top: 200, width: 104, height: 86,
        background: `linear-gradient(180deg, ${C.dress} 0%, ${C.dressShade} 100%)`,
        borderRadius: '16px 16px 20px 20px', zIndex: 7, boxShadow: softShadow,
      }} />

      {/* 裙摆毛绒花边 */}
      <div style={{
        position: 'absolute', left: CX-54, top: 280, width: 108, height: 12,
        background: C.white, borderRadius: '30% 30% 10px 10px', zIndex: 8, boxShadow: softInner,
      }} />
      {/* 花边波浪凸起 — 软圆 */}
      {[CX-48,CX-36,CX-24,CX-12,CX,CX+12,CX+24,CX+36].map((x,i) => (
        <div key={`h${i}`} style={{
          position:'absolute', left:x, top:286, width:12, height:8,
          background:C.white, borderRadius:'60% 60% 40% 40%', zIndex:8, boxShadow:softInner,
        }} />
      ))}

      {/* 领口双层不规则波浪花边 */}
      <div style={{
        position: 'absolute', left: CX-44, top: 194, width: 88, height: 12,
        background: C.white, borderRadius: '18px 18px 0 0', zIndex: 9, boxShadow: softInner,
      }} />
      {/* 领口里层花边 */}
      <div style={{
        position: 'absolute', left: CX-40, top: 198, width: 80, height: 7,
        background: C.white, borderRadius: '14px 14px 0 0', zIndex: 9, opacity: 0.7,
      }} />

      {/* 口袋左 */}
      <div style={{
        position:'absolute', left:CX-36, top:248, width:26, height:26,
        background:`linear-gradient(135deg, ${C.white}, #f0f0f4)`,
        borderRadius:'8px', zIndex:9, boxShadow:'0 1px 3px rgba(0,0,0,0.08)',
        border:'2px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{position:'absolute',left:6,top:8,width:12,height:9,
          borderRadius:'55% 55% 3px 3px',border:`1px solid ${C.brow}`,borderBottom:'none'}} />
        <div style={{position:'absolute',left:2,top:16,width:5,height:4,
          background:C.brow,borderRadius:'3px'}} />
        <div style={{position:'absolute',left:15,top:16,width:5,height:4,
          background:C.brow,borderRadius:'3px'}} />
      </div>
      {/* 口袋右 */}
      <div style={{
        position:'absolute', left:CX+10, top:248, width:26, height:26,
        background:`linear-gradient(135deg, ${C.white}, #f0f0f4)`,
        borderRadius:'8px', zIndex:9, boxShadow:'0 1px 3px rgba(0,0,0,0.08)',
        border:'2px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{position:'absolute',left:6,top:8,width:12,height:9,
          borderRadius:'55% 55% 3px 3px',border:`1px solid ${C.brow}`,borderBottom:'none'}} />
      </div>

      {/* 蝴蝶结 — 柔和浅粉色缎面 */}
      <div style={{position:'absolute', left:CX-16, top:198, width:32, height:18, zIndex:10}}>
        <div style={{position:'absolute',left:0,top:3,width:14,height:13,
          background:`radial-gradient(circle at 30% 30%, ${C.bowColor}, #e8a0b0)`,
          borderRadius:'60% 3px 60% 55%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}} />
        <div style={{position:'absolute',right:0,top:3,width:14,height:13,
          background:`radial-gradient(circle at 70% 30%, ${C.bowColor}, #e8a0b0)`,
          borderRadius:'3px 60% 55% 60%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}} />
        <div style={{position:'absolute',left:11,top:5,width:10,height:9,
          background:'#eda0b5',borderRadius:'50%',boxShadow:'0 0 2px rgba(0,0,0,0.06)'}} />
      </div>

      {/* 纽扣 x2 */}
      <div style={{position:'absolute',left:CX-5,top:226,width:11,height:11,
        background:`radial-gradient(circle at 40% 35%, #fff, ${C.white})`,
        borderRadius:'50%',zIndex:10,boxShadow:'0 1px 2px rgba(0,0,0,0.10)'}} />
      <div style={{position:'absolute',left:CX-5,top:242,width:11,height:11,
        background:`radial-gradient(circle at 40% 35%, #fff, ${C.white})`,
        borderRadius:'50%',zIndex:10,boxShadow:'0 1px 2px rgba(0,0,0,0.10)'}} />

      {/* ================================================================ */}
      {/* 袜子 — 米白中筒袜 + 双黑线                                           */}
      {/* ================================================================ */}
      <div style={{position:'absolute',left:CX-36,top:296,width:18,height:34,
        background:`linear-gradient(180deg, #fff, ${C.white})`,
        borderRadius:'6px 6px 9px 9px',zIndex:11,boxShadow:'0 2px 3px rgba(0,0,0,0.06)',
        borderTop:`2px solid ${C.black}`,
      }}>
        <div style={{position:'absolute',top:7,left:0,right:0,height:1,background:C.black}} />
        <div style={{position:'absolute',top:10,left:0,right:0,height:1,background:C.black}} />
      </div>
      <div style={{position:'absolute',left:CX+18,top:296,width:18,height:34,
        background:`linear-gradient(180deg, #fff, ${C.white})`,
        borderRadius:'6px 6px 9px 9px',zIndex:11,boxShadow:'0 2px 3px rgba(0,0,0,0.06)',
        borderTop:`2px solid ${C.black}`,
      }}>
        <div style={{position:'absolute',top:7,left:0,right:0,height:1,background:C.black}} />
        <div style={{position:'absolute',top:10,left:0,right:0,height:1,background:C.black}} />
      </div>

      {/* ================================================================ */}
      {/* 小皮鞋 — 圆乎乎哑光黑                                                 */}
      {/* ================================================================ */}
      <div style={{position:'absolute',left:CX-42,top:326,width:26,height:14,
        background:`radial-gradient(ellipse at 50% 30%, #3a3a3a, ${C.black})`,
        borderRadius:'55% 35% 45% 45%',zIndex:12,boxShadow:'0 2px 4px rgba(0,0,0,0.20)'}} />
      <div style={{position:'absolute',left:CX+16,top:326,width:26,height:14,
        background:`radial-gradient(ellipse at 50% 30%, #3a3a3a, ${C.black})`,
        borderRadius:'35% 55% 45% 45%',zIndex:12,boxShadow:'0 2px 4px rgba(0,0,0,0.20)'}} />

      {/* ================================================================ */}
      {/* 脸部 — 暖白包子圆脸 + 通透蜜桃腮红 + 柔和体积阴影                        */}
      {/* ================================================================ */}
      <div style={{
        position:'absolute',left:CX-44,top:112,width:88,height:84,
        background:`radial-gradient(ellipse at 50% 30%, ${C.skin}, ${C.skinShade})`,
        borderRadius:'48% 48% 50% 50%',zIndex:15,
        boxShadow:'0 3px 10px rgba(0,0,0,0.10), inset 0 2px 4px rgba(255,255,255,0.35)',
      }} />

      {/* 腮红 — 大面积通透晕染 */}
      <div style={{position:'absolute',left:CX-30,top:150,width:22,height:14,
        background:`radial-gradient(ellipse, ${C.blush} 0%, transparent 75%)`,
        borderRadius:'50%',zIndex:16,opacity:0.8,filter:'blur(2px)'}} />
      <div style={{position:'absolute',left:CX+8,top:150,width:22,height:14,
        background:`radial-gradient(ellipse, ${C.blush} 0%, transparent 75%)`,
        borderRadius:'50%',zIndex:16,opacity:0.8,filter:'blur(2px)'}} />

      {/* 耳朵 */}
      <div style={{position:'absolute',left:CX-54,top:138,width:16,height:16,
        background:`radial-gradient(circle at 50% 40%, ${C.skin}, ${C.skinShade})`,
        borderRadius:'50%',zIndex:16,boxShadow:'0 1px 2px rgba(0,0,0,0.06)'}} />
      <div style={{position:'absolute',left:CX+38,top:138,width:16,height:16,
        background:`radial-gradient(circle at 50% 40%, ${C.skin}, ${C.skinShade})`,
        borderRadius:'50%',zIndex:16,boxShadow:'0 1px 2px rgba(0,0,0,0.06)'}} />

      {/* ================================================================ */}
      {/* 眼睛 — 下垂无辜圆眼 + 通透水光高光                                     */}
      {/* ================================================================ */}
      {/* 左眼 */}
      <div style={{position:'absolute',left:CX-22,top:146,width:17,height:17,
        background:`radial-gradient(circle at 50% 40%, #c8c0c8, ${C.eyeBase})`,
        borderRadius:'50%',zIndex:17,boxShadow:'0 1px 2px rgba(0,0,0,0.06)'}}>
        <div style={{position:'absolute',left:4,top:3,width:6,height:5,
          background:`radial-gradient(circle, ${C.eyeHi}, rgba(255,255,255,0.5))`,
          borderRadius:'50%'}} />
        <div style={{position:'absolute',left:7,top:5,width:3,height:2,
          background:C.eyeHi,borderRadius:'50%',opacity:0.7}} />
      </div>
      {/* 右眼 */}
      <div style={{position:'absolute',left:CX+5,top:146,width:17,height:17,
        background:`radial-gradient(circle at 50% 40%, #c8c0c8, ${C.eyeBase})`,
        borderRadius:'50%',zIndex:17,boxShadow:'0 1px 2px rgba(0,0,0,0.06)'}}>
        <div style={{position:'absolute',left:4,top:3,width:6,height:5,
          background:`radial-gradient(circle, ${C.eyeHi}, rgba(255,255,255,0.5))`,
          borderRadius:'50%'}} />
        <div style={{position:'absolute',left:7,top:5,width:3,height:2,
          background:C.eyeHi,borderRadius:'50%',opacity:0.7}} />
      </div>

      {/* 眉毛 — 细浅灰弯眉 */}
      <div style={{position:'absolute',left:CX-22,top:138,width:18,height:4,
        background:C.brow,borderRadius:'60%',transform:browTilt,zIndex:18,
        boxShadow:'0 0 1px rgba(0,0,0,0.04)'}} />
      <div style={{position:'absolute',left:CX+4,top:138,width:18,height:4,
        background:C.brow,borderRadius:'60%',transform:browTilt,zIndex:18,
        boxShadow:'0 0 1px rgba(0,0,0,0.04)'}} />

      {/* 嘴巴 — 小巧微张浅粉色 */}
      <div style={{position:'absolute',left:CX-mouthW/2,top:mouthY,
        width:mouthW,height:mouthH,
        background:`radial-gradient(ellipse, ${C.lip}, #f0b8c4)`,
        borderRadius:isHappy?'3px 3px 10px 10px':'50%',zIndex:18,
        boxShadow:'0 0 2px rgba(0,0,0,0.04)'}} />

      {/* ================================================================ */}
      {/* 齐刘海 — 轻薄柔和弧线                                                 */}
      {/* ================================================================ */}
      {[CX-40,CX-30,CX-20,CX-10,CX,CX+10,CX+20,CX+30].map((x,i)=>(
        <div key={`b${i}`} style={{
          position:'absolute',left:x,top:100,
          width:14,height:20,background:C.hair,
          borderRadius:'50% 50% 40% 40%',zIndex:19,
          boxShadow:'0 1px 1px rgba(0,0,0,0.03)',
        }} />
      ))}
      {/* 刘海两侧小碎发 */}
      <div style={{position:'absolute',left:CX-44,top:108,width:10,height:14,
        background:C.hair,borderRadius:'0 0 0 80%',zIndex:19,transform:'rotate(12deg)'}} />
      <div style={{position:'absolute',left:CX+34,top:108,width:10,height:14,
        background:C.hair,borderRadius:'0 0 80% 0',zIndex:19,transform:'rotate(-12deg)'}} />

      {/* 发夹 — 浅灰色长方形细发夹 */}
      <div style={{position:'absolute',left:CX+10,top:114,width:20,height:7,
        background:`linear-gradient(180deg, #e0e0e6, ${C.clip})`,
        borderRadius:'3px',zIndex:20,boxShadow:'0 1px 2px rgba(0,0,0,0.06)'}} />

      {/* ================================================================ */}
      {/* 帕恰狗毛绒头套                                                      */}
      {/* ================================================================ */}
      {/* 头套帽身 — 蓬松柔软大白团 */}
      <div style={{position:'absolute',left:CX-50,top:76,width:100,height:64,
        background:`radial-gradient(ellipse at 50% 30%, #fff, ${C.white}, #eeeef2)`,
        borderRadius:'55% 55% 12px 12px',zIndex:25,
        boxShadow:'0 4px 12px rgba(0,0,0,0.10), inset 0 3px 6px rgba(255,255,255,0.6)',
      }} />

      {/* 头套黑耳朵 — 蓬松垂狗耳 */}
      <div style={{position:'absolute',left:CX-58,top:66,width:36,height:32,
        background:`radial-gradient(ellipse at 50% 30%, #333, ${C.black})`,
        borderRadius:'55% 50% 50% 45%',transform:'rotate(-18deg)',zIndex:26,
        boxShadow:'0 2px 4px rgba(0,0,0,0.15)'}} />
      <div style={{position:'absolute',left:CX+22,top:66,width:36,height:32,
        background:`radial-gradient(ellipse at 50% 30%, #333, ${C.black})`,
        borderRadius:'50% 55% 45% 50%',transform:'rotate(18deg)',zIndex:26,
        boxShadow:'0 2px 4px rgba(0,0,0,0.15)'}} />

      {/* 头套豆豆眼 */}
      <div style={{position:'absolute',left:CX-15,top:96,width:11,height:11,
        background:`radial-gradient(circle at 50% 40%, #444, ${C.black})`,
        borderRadius:'50%',zIndex:27}} />
      <div style={{position:'absolute',left:CX+4,top:96,width:11,height:11,
        background:`radial-gradient(circle at 50% 40%, #444, ${C.black})`,
        borderRadius:'50%',zIndex:27}} />
      {/* 头套小波浪嘴 */}
      <svg style={{position:'absolute',left:CX-9,top:107,width:18,height:9,zIndex:27}}
        viewBox="0 0 18 9">
        <path d="M3,3 Q6,1 9,3 Q12,5 15,3" fill="none" stroke={C.black}
          strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {/* 头套腮红 — 淡粉椭圆软色块 */}
      <div style={{position:'absolute',left:CX-24,top:104,width:14,height:9,
        background:`radial-gradient(ellipse, ${C.hoodBlush}, transparent)`,
        borderRadius:'50%',zIndex:27,opacity:0.7,filter:'blur(1.5px)'}} />
      <div style={{position:'absolute',left:CX+10,top:104,width:14,height:9,
        background:`radial-gradient(ellipse, ${C.hoodBlush}, transparent)`,
        borderRadius:'50%',zIndex:27,opacity:0.7,filter:'blur(1.5px)'}} />

      {/* 头套飘带 — 自然搭在脸颊两侧，末端圆滚滚毛球 */}
      <div style={{position:'absolute',left:CX-46,top:106,width:14,height:92,
        background:`linear-gradient(180deg, #fff 0%, ${C.white} 70%, #eeeef2 100%)`,
        borderRadius:'4px 4px 10px 10px',zIndex:28,
        boxShadow:'0 2px 4px rgba(0,0,0,0.06)'}}>
        <div style={{position:'absolute',bottom:-8,left:-4,width:22,height:14,
          background:`radial-gradient(ellipse at 50% 40%, #fff, ${C.white})`,
          borderRadius:'50%',boxShadow:'0 2px 3px rgba(0,0,0,0.06)'}} />
      </div>
      <div style={{position:'absolute',left:CX+32,top:106,width:14,height:92,
        background:`linear-gradient(180deg, #fff 0%, ${C.white} 70%, #eeeef2 100%)`,
        borderRadius:'4px 4px 10px 10px',zIndex:28,
        boxShadow:'0 2px 4px rgba(0,0,0,0.06)'}}>
        <div style={{position:'absolute',bottom:-8,left:-4,width:22,height:14,
          background:`radial-gradient(ellipse at 50% 40%, #fff, ${C.white})`,
          borderRadius:'50%',boxShadow:'0 2px 3px rgba(0,0,0,0.06)'}} />
      </div>

      {/* ================================================================ */}
      {/* Stage 4 — 柔和光晕                                                   */}
      {/* ================================================================ */}
      {stage >= 4 && (
        <div style={{
          position:'absolute',left:CX-46,top:126,width:92,height:80,
          background:'radial-gradient(ellipse, rgba(255,215,0,0.10), rgba(255,180,180,0.06), transparent)',
          filter:'blur(6px)',zIndex:29,pointerEvents:'none',
        }} />
      )}

      {/* ================================================================ */}
      {/* Stage 5 — 大师特效：皇冠 + 飘浮星点                                     */}
      {/* ================================================================ */}
      {stage >= 5 && (
        <>
          <div style={{
            position:'absolute',left:CX-12,top:58,fontSize:20,zIndex:30,
            filter:'drop-shadow(0 0 5px rgba(255,215,0,0.50))',
          }}>👑</div>
          {[
            [CX-64,86],[CX+50,96],[CX-24,48],[CX+32,54],
            [CX+58,158],[CX-60,196],[CX-10,42],[CX+44,70],
          ].map(([x,y],i)=>(
            <div key={`sp${i}`} style={{
              position:'absolute',left:x as number,top:y as number,
              width:6,height:6,
              background:'radial-gradient(circle, #FFE082, rgba(255,215,0,0.3))',
              borderRadius:'50%',zIndex:30,
              opacity:0.55+Math.sin(i)*0.3,
              filter:'blur(0.5px)',
              animation:`shimmer ${1.8+i*0.3}s ease-in-out infinite`,
            }} />
          ))}
        </>
      )}

      {/* 缩放包裹层结束 */}
      </div>
    </div>
  );
}
