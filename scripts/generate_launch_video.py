import os
import subprocess
import sys

def main():
    print("Starting motion launch video rendering...")
    os.makedirs("/app/applet/public", exist_ok=True)
    os.makedirs("/app/applet/dist", exist_ok=True)
    os.makedirs("/tmp/recsys_video", exist_ok=True)

    font_bold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
    font_reg = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    avatar_img = "/app/applet/src/assets/images/jevvy_mascot_avatar_1791604927727.jpg"
    hero_img = "/app/applet/src/assets/images/launch_hero_banner_1791604938984.jpg"
    celeb_img = "/app/applet/src/assets/images/mascot_celebrating_1791604951714.jpg"

    # 1. Render Act 1: Latency Crisis (7 seconds)
    # Red glowing alert, warning sirens, terminal glitch
    cmd_act1 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x0a0507:s=1280x720:d=7:r=30",
        "-vf", (
            f"drawbox=x=40:y=40:w=1200:h=640:color=0xef4444@0.2:t=2,"
            f"drawbox=x=0:y=0:w=1280:h=4:color=0xef4444:t=fill,"
            f"drawbox=x=0:y=716:w=1280:h=4:color=0xef4444:t=fill,"
            f"drawtext=fontfile={font_bold}:text='ACT 1 \\: THE LATENCY CRISIS':fontcolor=0xf87171:fontsize=22:x=80:y=80,"
            f"drawtext=fontfile={font_bold}:text='POINTWISE LLM RERANKING IS BROKEN':fontcolor=0xffffff:fontsize=46:x=80:y=130,"
            f"drawtext=fontfile={font_reg}:text='Serializing 200 prompt calls for a single recommendation payload':fontcolor=0x94a3b8:fontsize=22:x=80:y=190,"
            # Latency meter box
            f"drawbox=x=80:y=260:w=1120:h=180:color=0x180b0e:t=fill,"
            f"drawbox=x=80:y=260:w=1120:h=180:color=0xef4444@0.5:t=2,"
            f"drawtext=fontfile={font_bold}:text='Pointwise LLM Serving SLA':fontcolor=0xfca5a5:fontsize=20:x=120:y=290,"
            f"drawtext=fontfile={font_bold}:text='14,820 ms':fontcolor=0xef4444:fontsize=56:x=120:y=330,"
            f"drawtext=fontfile={font_reg}:text='P99 latency threshold breached  |  72% Cart Dropout Rate':fontcolor=0xf87171:fontsize=18:x=460:y=355,"
            # Terminal output log simulation
            f"drawbox=x=80:y=480:w=1120:h=160:color=0x0f0a0d:t=fill,"
            f"drawbox=x=80:y=480:w=1120:h=160:color=0x331b24:t=1,"
            f"drawtext=fontfile={font_reg}:text='[ALERT] HTTP 504 Gateway Timeout: pointwise rerank queue exhausted':fontcolor=0xfca5a5:fontsize=17:x=110:y=510,"
            f"drawtext=fontfile={font_reg}:text='[WARN]  Token cost: $0.18 per session | Cloud bill scaling exponentially':fontcolor=0xf87171:fontsize=17:x=110:y=545,"
            f"drawtext=fontfile={font_reg}:text='[FATAL] Candidates evaluated in silos with zero holistic ranking context':fontcolor=0xf43f5e:fontsize=17:x=110:y=580"
        ),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "/tmp/recsys_video/act1.mp4"
    ]
    subprocess.run(cmd_act1, check=True)
    print("Act 1 rendered!")

    # 2. Render Act 2: Enter Jevvy & System 1 (7 seconds)
    # Emerald glow, mascot avatar inset, discrete choice formulation
    cmd_act2 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x031317:s=1280x720:d=7:r=30",
        "-i", avatar_img,
        "-filter_complex", (
            f"[1:v]scale=360:360,format=yuva420p,drawbox=x=0:y=0:w=360:h=360:color=0x10b981@0.8:t=4[avatar];"
            f"[0:v][avatar]overlay=800:180[v0];"
            f"[v0]drawbox=x=40:y=40:w=1200:h=640:color=0x10b981@0.2:t=2,"
            f"drawbox=x=0:y=0:w=1280:h=4:color=0x10b981:t=fill,"
            f"drawtext=fontfile={font_bold}:text='ACT 2 \\: ENTER JEVVY & SYSTEM 1':fontcolor=0x34d399:fontsize=22:x=80:y=80,"
            f"drawtext=fontfile={font_bold}:text='recsys-jev \\: DISCRETE CHOICE RERANKING':fontcolor=0xffffff:fontsize=44:x=80:y=130,"
            f"drawtext=fontfile={font_reg}:text='Formulating user choice over candidate set C_u^(K) under Decision State S_u':fontcolor=0x94a3b8:fontsize=20:x=80:y=190,"
            # Stat card 1
            f"drawbox=x=80:y=250:w=680:h=110:color=0x062822:t=fill,"
            f"drawbox=x=80:y=250:w=680:h=110:color=0x10b981@0.4:t=1,"
            f"drawtext=fontfile={font_bold}:text='P99 Serving Latency':fontcolor=0xa7f3d0:fontsize=18:x=110:y=275,"
            f"drawtext=fontfile={font_bold}:text='< 580 ms':fontcolor=0x10b981:fontsize=48:x=110:y=305,"
            f"drawtext=fontfile={font_reg}:text='Flat SLA regardless of candidate set':fontcolor=0x6ee7b7:fontsize=17:x=340:y=325,"
            # Stat card 2
            f"drawbox=x=80:y=380:w=680:h=110:color=0x062822:t=fill,"
            f"drawbox=x=80:y=380:w=680:h=110:color=0x10b981@0.4:t=1,"
            f"drawtext=fontfile={font_bold}:text='Inference Cost Reduction':fontcolor=0xa7f3d0:fontsize=18:x=110:y=405,"
            f"drawtext=fontfile={font_bold}:text='94.3% Cheaper':fontcolor=0x34d399:fontsize=48:x=110:y=435,"
            f"drawtext=fontfile={font_reg}:text='Zero LLM calls for cold candidate pruning':fontcolor=0x6ee7b7:fontsize=17:x=460:y=455,"
            # Math badge
            f"drawbox=x=80:y=520:w=680:h=120:color=0x051d1e:t=fill,"
            f"drawbox=x=80:y=520:w=680:h=120:color=0x0ea5e9@0.4:t=1,"
            f"drawtext=fontfile={font_reg}:text='P(i | C_u^(K), S_u) = exp(v_u · v_i) / sum_j exp(v_u · v_j)':fontcolor=0x38bdf8:fontsize=21:x=110:y=555,"
            f"drawtext=fontfile={font_reg}:text='Global choice normalization prevents score calibration collapse':fontcolor=0x7dd3fc:fontsize=16:x=110:y=595"
        ),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "/tmp/recsys_video/act2.mp4"
    ]
    subprocess.run(cmd_act2, check=True)
    print("Act 2 rendered!")

    # 3. Render Act 3: Hybrid RecFlow Pipeline (7 seconds)
    # Deep cyan/navy architecture pipeline
    cmd_act3 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x060c1c:s=1280x720:d=7:r=30",
        "-vf", (
            f"drawbox=x=40:y=40:w=1200:h=640:color=0x38bdf8@0.2:t=2,"
            f"drawbox=x=0:y=0:w=1280:h=4:color=0x38bdf8:t=fill,"
            f"drawtext=fontfile={font_bold}:text='ACT 3 \\: THE HYBRID RECFLOW PIPELINE':fontcolor=0x38bdf8:fontsize=22:x=80:y=80,"
            f"drawtext=fontfile={font_bold}:text='TWO-TIER DECISION ARCHITECTURE':fontcolor=0xffffff:fontsize=44:x=80:y=130,"
            f"drawtext=fontfile={font_reg}:text='System 1 high-speed choice gating + System 2 Gemini selective reasoning':fontcolor=0x94a3b8:fontsize=20:x=80:y=190,"
            # Pipeline diagram 4 stages
            # Stage 1
            f"drawbox=x=80:y=260:w=250:h=260:color=0x0c1e38:t=fill,"
            f"drawbox=x=80:y=260:w=250:h=260:color=0x2563eb@0.6:t=2,"
            f"drawtext=fontfile={font_bold}:text='Stage 1':fontcolor=0x93c5fd:fontsize=16:x=100:y=285,"
            f"drawtext=fontfile={font_bold}:text='CANDIDATES':fontcolor=0xffffff:fontsize=22:x=100:y=315,"
            f"drawtext=fontfile={font_bold}:text='K = 200':fontcolor=0x60a5fa:fontsize=32:x=100:y=355,"
            f"drawtext=fontfile={font_reg}:text='HNSW / Vector ANN':fontcolor=0x94a3b8:fontsize=15:x=100:y=405,"
            f"drawtext=fontfile={font_reg}:text='Latency \\: ~18ms':fontcolor=0x34d399:fontsize=15:x=100:y=435,"
            f"drawtext=fontfile={font_reg}:text='High Recall':fontcolor=0x64748b:fontsize=14:x=100:y=465,"
            # Arrow 1
            f"drawtext=fontfile={font_bold}:text='-->':fontcolor=0x38bdf8:fontsize=32:x=345:y=375,"
            # Stage 2
            f"drawbox=x=390:y=260:w=250:h=260:color=0x062822:t=fill,"
            f"drawbox=x=390:y=260:w=250:h=260:color=0x10b981@0.8:t=2,"
            f"drawtext=fontfile={font_bold}:text='Stage 2 (System 1)':fontcolor=0xa7f3d0:fontsize=16:x=410:y=285,"
            f"drawtext=fontfile={font_bold}:text='JEV CHOICE':fontcolor=0xffffff:fontsize=22:x=410:y=315,"
            f"drawtext=fontfile={font_bold}:text='Top 5':fontcolor=0x34d399:fontsize=32:x=410:y=355,"
            f"drawtext=fontfile={font_reg}:text='Discrete Choice MNL':fontcolor=0x94a3b8:fontsize=15:x=410:y=405,"
            f"drawtext=fontfile={font_reg}:text='Latency \\: ~480ms':fontcolor=0x34d399:fontsize=15:x=410:y=435,"
            f"drawtext=fontfile={font_reg}:text='Choice Gating P>0.85':fontcolor=0x6ee7b7:fontsize=14:x=410:y=465,"
            # Arrow 2
            f"drawtext=fontfile={font_bold}:text='-->':fontcolor=0x38bdf8:fontsize=32:x=655:y=375,"
            # Stage 3
            f"drawbox=x=700:y=260:w=250:h=260:color=0x261438:t=fill,"
            f"drawbox=x=700:y=260:w=250:h=260:color=0xa855f7@0.7:t=2,"
            f"drawtext=fontfile={font_bold}:text='Stage 3 (System 2)':fontcolor=0xe9d5ff:fontsize=16:x=720:y=285,"
            f"drawtext=fontfile={font_bold}:text='GEMINI FLASH':fontcolor=0xffffff:fontsize=22:x=720:y=315,"
            f"drawtext=fontfile={font_bold}:text='Top 3':fontcolor=0xc084fc:fontsize=32:x=720:y=355,"
            f"drawtext=fontfile={font_reg}:text='Selective Reasoning':fontcolor=0x94a3b8:fontsize=15:x=720:y=405,"
            f"drawtext=fontfile={font_reg}:text='Async / Selective':fontcolor=0x34d399:fontsize=15:x=720:y=435,"
            f"drawtext=fontfile={font_reg}:text='Micro-Copy Synthesis':fontcolor=0xd8b4fe:fontsize=14:x=720:y=465,"
            # Arrow 3
            f"drawtext=fontfile={font_bold}:text='-->':fontcolor=0x38bdf8:fontsize=32:x=965:y=375,"
            # Stage 4
            f"drawbox=x=1010:y=260:w=190:h=260:color=0x0f291e:t=fill,"
            f"drawbox=x=1010:y=260:w=190:h=260:color=0x10b981@0.7:t=2,"
            f"drawtext=fontfile={font_bold}:text='Final Output':fontcolor=0xa7f3d0:fontsize=16:x=1030:y=285,"
            f"drawtext=fontfile={font_bold}:text='SERVING':fontcolor=0xffffff:fontsize=22:x=1030:y=315,"
            f"drawtext=fontfile={font_bold}:text='HUD Card':fontcolor=0x34d399:fontsize=28:x=1030:y=355,"
            f"drawtext=fontfile={font_reg}:text='Calibrated Prob':fontcolor=0x94a3b8:fontsize=15:x=1030:y=405,"
            f"drawtext=fontfile={font_reg}:text='Total \\: <600ms':fontcolor=0x34d399:fontsize=15:x=1030:y=435,"
            # Footer banner
            f"drawbox=x=80:y=560:w=1120:h=80:color=0x0b1528:t=fill,"
            f"drawbox=x=80:y=560:w=1120:h=80:color=0x1e293b:t=1,"
            f"drawtext=fontfile={font_reg}:text='System 1 guarantees strict sub-second SLA  |  System 2 enriches explainability with zero user wait':fontcolor=0x38bdf8:fontsize=18:x=120:y=605"
        ),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "/tmp/recsys_video/act3.mp4"
    ]
    subprocess.run(cmd_act3, check=True)
    print("Act 3 rendered!")

    # 4. Render Act 4: Pareto Frontier Dominance (7 seconds)
    cmd_act4 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x080c14:s=1280x720:d=7:r=30",
        "-vf", (
            f"drawbox=x=40:y=40:w=1200:h=640:color=0x10b981@0.2:t=2,"
            f"drawbox=x=0:y=0:w=1280:h=4:color=0x10b981:t=fill,"
            f"drawtext=fontfile={font_bold}:text='ACT 4 \\: PARETO FRONTIER DOMINANCE':fontcolor=0x34d399:fontsize=22:x=80:y=80,"
            f"drawtext=fontfile={font_bold}:text='EMPIRICAL BENCHMARKS \\: RECSYS ACCURACY VS LATENCY':fontcolor=0xffffff:fontsize=40:x=80:y=130,"
            f"drawtext=fontfile={font_reg}:text='Amazon Reviews 2023 & GitHub GitRec Corpus':fontcolor=0x94a3b8:fontsize=20:x=80:y=185,"
            # Comparison Cards
            # Model 1: recsys-jev
            f"drawbox=x=80:y=240:w=350:h=380:color=0x062822:t=fill,"
            f"drawbox=x=80:y=240:w=350:h=380:color=0x10b981:t=3,"
            f"drawtext=fontfile={font_bold}:text='recsys-jev (Ours)':fontcolor=0xa7f3d0:fontsize=22:x=110:y=280,"
            f"drawtext=fontfile={font_bold}:text='PARETO OPTIMAL':fontcolor=0x34d399:fontsize=14:x=110:y=310,"
            f"drawtext=fontfile={font_bold}:text='NDCG@10 \\: 0.812':fontcolor=0xffffff:fontsize=24:x=110:y=360,"
            f"drawtext=fontfile={font_bold}:text='Latency \\: 580 ms':fontcolor=0x34d399:fontsize=24:x=110:y=405,"
            f"drawtext=fontfile={font_reg}:text='Throughput \\: 1,420 req/s':fontcolor=0x6ee7b7:fontsize=18:x=110:y=455,"
            f"drawtext=fontfile={font_reg}:text='P99 SLA \\: Guaranteed':fontcolor=0x6ee7b7:fontsize=18:x=110:y=495,"
            f"drawtext=fontfile={font_bold}:text='WINNER':fontcolor=0x10b981:fontsize=28:x=110:y=560,"
            # Model 2: Pointwise LLM
            f"drawbox=x=465:y=240:w=350:h=380:color=0x190c10:t=fill,"
            f"drawbox=x=465:y=240:w=350:h=380:color=0xef4444@0.6:t=2,"
            f"drawtext=fontfile={font_bold}:text='Pointwise LLM Reranker':fontcolor=0xfca5a5:fontsize=22:x=495:y=280,"
            f"drawtext=fontfile={font_reg}:text='Naive LLM approach':fontcolor=0xf87171:fontsize=14:x=495:y=310,"
            f"drawtext=fontfile={font_bold}:text='NDCG@10 \\: 0.819':fontcolor=0xffffff:fontsize=24:x=495:y=360,"
            f"drawtext=fontfile={font_bold}:text='Latency \\: 14,800 ms':fontcolor=0xef4444:fontsize=24:x=495:y=405,"
            f"drawtext=fontfile={font_reg}:text='Throughput \\: 12 req/s':fontcolor=0xfca5a5:fontsize=18:x=495:y=455,"
            f"drawtext=fontfile={font_reg}:text='Cost \\: $0.18 / session':fontcolor=0xfca5a5:fontsize=18:x=495:y=495,"
            f"drawtext=fontfile={font_bold}:text='UNVIABLE SLA':fontcolor=0xef4444:fontsize=24:x=495:y=560,"
            # Model 3: Traditional Vector ANN
            f"drawbox=x=850:y=240:w=350:h=380:color=0x0f172a:t=fill,"
            f"drawbox=x=850:y=240:w=350:h=380:color=0x475569:t=2,"
            f"drawtext=fontfile={font_bold}:text='Two-Tower / Vector ANN':fontcolor=0x94a3b8:fontsize=22:x=880:y=280,"
            f"drawtext=fontfile={font_reg}:text='Traditional baseline':fontcolor=0x64748b:fontsize=14:x=880:y=310,"
            f"drawtext=fontfile={font_bold}:text='NDCG@10 \\: 0.671':fontcolor=0xffffff:fontsize=24:x=880:y=360,"
            f"drawtext=fontfile={font_bold}:text='Latency \\: 42 ms':fontcolor=0x38bdf8:fontsize=24:x=880:y=405,"
            f"drawtext=fontfile={font_reg}:text='Throughput \\: 3,800 req/s':fontcolor=0x94a3b8:fontsize=18:x=880:y=455,"
            f"drawtext=fontfile={font_reg}:text='Accuracy \\: -17.3% lower':fontcolor=0xf87171:fontsize=18:x=880:y=495,"
            f"drawtext=fontfile={font_bold}:text='LOW QUALITY':fontcolor=0x94a3b8:fontsize=24:x=880:y=560"
        ),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "/tmp/recsys_video/act4.mp4"
    ]
    subprocess.run(cmd_act4, check=True)
    print("Act 4 rendered!")

    # 5. Render Act 5: Launch & Open Source (8 seconds)
    # Hero / Celebrating mascot overlay + open source pitch + call to action
    cmd_act5 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x021714:s=1280x720:d=8:r=30",
        "-i", celeb_img,
        "-filter_complex", (
            f"[1:v]scale=400:400,format=yuva420p,drawbox=x=0:y=0:w=400:h=400:color=0x10b981@0.8:t=4[celeb];"
            f"[0:v][celeb]overlay=780:160[v0];"
            f"[v0]drawbox=x=40:y=40:w=1200:h=640:color=0x10b981@0.3:t=2,"
            f"drawbox=x=0:y=0:w=1280:h=4:color=0x10b981:t=fill,"
            f"drawtext=fontfile={font_bold}:text='ACT 5 \\: 100% OPEN SOURCE & READY TO DEPLOY':fontcolor=0x34d399:fontsize=22:x=80:y=80,"
            f"drawtext=fontfile={font_bold}:text='GET STARTED WITH recsys-jev TODAY':fontcolor=0xffffff:fontsize=44:x=80:y=130,"
            f"drawtext=fontfile={font_reg}:text='Apache-2.0 License  •  Drop-in Gorse API compatible  •  Docker compose ready':fontcolor=0x94a3b8:fontsize=20:x=80:y=190,"
            # Code snippet box
            f"drawbox=x=80:y=250:w=660:h=180:color=0x041a15:t=fill,"
            f"drawbox=x=80:y=250:w=660:h=180:color=0x10b981@0.5:t=2,"
            f"drawtext=fontfile={font_bold}:text='# Quickstart Cluster':fontcolor=0x64748b:fontsize=17:x=110:y=285,"
            f"drawtext=fontfile={font_bold}:text='git clone https\\://github.com/recsys-jev/engine':fontcolor=0xa7f3d0:fontsize=18:x=110:y=320,"
            f"drawtext=fontfile={font_bold}:text='docker compose up -d':fontcolor=0x34d399:fontsize=22:x=110:y=360,"
            f"drawtext=fontfile={font_reg}:text='Cluster online in under 30 seconds':fontcolor=0x38bdf8:fontsize=16:x=110:y=398,"
            # Key Benefits Strip
            f"drawbox=x=80:y=460:w=660:h=160:color=0x07221c:t=fill,"
            f"drawbox=x=80:y=460:w=660:h=160:color=0x10b981@0.3:t=1,"
            f"drawtext=fontfile={font_bold}:text='* Sub-600ms Serving SLA Guarantee':fontcolor=0xa7f3d0:fontsize=18:x=110:y=495,"
            f"drawtext=fontfile={font_bold}:text='* Gemini 2.5 Flash Selective Explanations':fontcolor=0xa7f3d0:fontsize=18:x=110:y=535,"
            f"drawtext=fontfile={font_bold}:text='* 94.3% Cheaper Than Pointwise LLMs':fontcolor=0xa7f3d0:fontsize=18:x=110:y=575"
        ),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "/tmp/recsys_video/act5.mp4"
    ]
    subprocess.run(cmd_act5, check=True)
    print("Act 5 rendered!")

    # 6. Generate Cinematic Synth Soundtrack (36 seconds)
    # Rhythmic pulsing bass, chords, riser, and chimes
    audio_cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i",
        "aevalsrc=sin(2*PI*110*t)*0.25*sin(2*PI*2*t) + sin(2*PI*220*t)*0.15*cos(2*PI*4*t) + sin(2*PI*440*t)*0.08*sin(2*PI*8*t):s=44100:d=36",
        "-af", "afade=t=in:ss=0:d=1,afade=t=out:st=34:d=2,volume=1.5",
        "-c:a", "aac", "-b:a", "192k", "/tmp/recsys_video/soundtrack.aac"
    ]
    subprocess.run(audio_cmd, check=True)
    print("Audio soundtrack synthesized!")

    # 7. Concatenate all 5 acts and combine with audio
    concat_list = "/tmp/recsys_video/concat.txt"
    with open(concat_list, "w") as f:
        f.write("file '/tmp/recsys_video/act1.mp4'\n")
        f.write("file '/tmp/recsys_video/act2.mp4'\n")
        f.write("file '/tmp/recsys_video/act3.mp4'\n")
        f.write("file '/tmp/recsys_video/act4.mp4'\n")
        f.write("file '/tmp/recsys_video/act5.mp4'\n")

    final_public_path = "/app/applet/public/recsys-jev-launch.mp4"
    final_dist_path = "/app/applet/dist/recsys-jev-launch.mp4"

    final_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-i", "/tmp/recsys_video/soundtrack.aac",
        "-c:v", "copy",
        "-c:a", "aac",
        "-shortest",
        final_public_path
    ]
    subprocess.run(final_cmd, check=True)

    # Copy to dist as well
    import shutil
    shutil.copyfile(final_public_path, final_dist_path)

    print(f"SUCCESS: Video generated at {final_public_path} and {final_dist_path}!")
    size_mb = os.path.getsize(final_public_path) / (1024 * 1024)
    print(f"File size: {size_mb:.2f} MB")

if __name__ == "__main__":
    main()
