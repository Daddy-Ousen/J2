"""Batch Google Flow 3D Jersey Renderer
Uses the local flow-agent environment to render all remaining jerseys.
"""

import os
import sys
import subprocess
import time

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

PROJECT_DIR = r"D:\AntigravityProjects\j2"
FLOW_DIR = os.path.join(PROJECT_DIR, "tools", "flow-agent", "flow-agent")
PYTHON_EXE = os.path.join(FLOW_DIR, ".venv", "Scripts", "python.exe")
MAIN_PY = os.path.join(FLOW_DIR, "main.py")

REMAINING_JERSEYS = [
    {
        "slug": "psg-24-25-home-hechter",
        "name": "Paris Saint-Germain 24/25 Home Hechter",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\768370712_1556661692810218_4677040006219346040_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\psg_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Paris Saint-Germain navy blue and brushstroke red Hechter stripe 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle Parisian crimson rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed micro-knit fabric texture, realistic cloth physics and subtle folds, crisp 3D PSG crest badge with tactile relief, Qatar Airways chest sponsor, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "portugal-24-25-home-euro",
        "name": "Portugal 24/25 Home Euro Edition",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\763823859_1583011720283222_2851934501615774876_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\portugal_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Portugal deep red and forest green collar 24/25 Euro football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed micro-mesh fabric texture, realistic cloth physics and subtle folds, crisp 3D Portugal FPF national federation crest shield badge with tactile relief, gold detailing, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "argentina-24-25-home-three-stars",
        "name": "Argentina 24/25 Home Three Stars",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\764456853_1965653597482863_1460892311231210086_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\argentina_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Argentina albiceleste sky blue and white vertical stripe three stars 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed pique fabric texture, realistic cloth physics and subtle folds, crisp 3D AFA crest with three golden stars and central gold World Champion crest with tactile relief, gold sun of may, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "brazil-24-25-home-canarinho",
        "name": "Brazil 24/25 Home Canarinho",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\769777128_1035076262668606_5368825136109641237_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\brazil_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Brazil vibrant yellow Canarinho and green collar 24/25 home football jersey with subtle fauna/flora embossed texture based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed jacquard weave texture, realistic cloth physics and subtle folds, crisp 3D CBF crest badge with five green stars with tactile relief, central crest placement, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "borussia-dortmund-24-25-home",
        "name": "Borussia Dortmund 24/25 Home Signal Iduna",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\770175067_27755399217458460_6570759974122191073_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\bvb_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Borussia Dortmund cyber yellow and black sleeve 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle electric yellow rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed Ultraweave fabric texture, realistic cloth physics and subtle folds, crisp 3D BVB 09 circular crest with two gold stars with tactile relief, 1&1 chest sponsor, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "arsenal-24-25-home-emirates",
        "name": "Arsenal 24/25 Home Emirates Stadium",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\771755831_2030443044259781_1848338457602950862_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\arsenal_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Arsenal scarlet red and white sleeve with navy blue accents 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle scarlet rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed micro-knit fabric texture, realistic cloth physics and subtle folds, crisp 3D gold cannon crest badge with tactile relief, Emirates Fly Better sponsor, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "chelsea-24-25-home-liquid-blue",
        "name": "Chelsea 24/25 Home Liquid Blue",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\772583124_1350347663948542_6345441942656116983_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\chelsea_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Chelsea liquid flame royal blue and iridescent orange-silver melt pattern 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle iridescent blue-silver rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed liquid jacquard fabric texture, realistic cloth physics and subtle folds, crisp 3D iridescent holographic Chelsea lion crest badge with tactile relief, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "real-madrid-24-25-home-classic-white",
        "name": "Real Madrid 24/25 Home Classic White",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\773519315_998900029802292_8927852557036847975_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\real_madrid_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Real Madrid pristine white houndstooth jacquard and black triple stripe 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed houndstooth micro-jacquard fabric texture, realistic cloth physics and subtle folds, crisp 3D Real Madrid royal crest badge with tactile relief, Emirates Fly Better sponsor, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "france-24-25-home-rooster",
        "name": "France 24/25 Home Euro Authentic",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\774087671_28271423172481205_952571838023709533_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\france_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact France bright royal blue and oversized vintage gold Gallic rooster 24/25 Euro football jersey with tricolor collar based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle French blue rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed micro-weave fabric texture, realistic cloth physics and subtle folds, crisp 3D giant metallic gold Cockerel crest with two stars with tactile relief, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "england-24-25-home-three-lions",
        "name": "England 24/25 Home Three Lions",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\774664994_1078708957920797_8043803022560338520_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\england_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact England pure white and deep navy collar with purple-red cuff accents 24/25 Euro football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle silver rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed micro-knit fabric texture, realistic cloth physics and subtle folds, crisp 3D England Three Lions crest shield badge with tactile relief and gold star, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "germany-24-25-home-dfb",
        "name": "Germany 24/25 Home DFB Euro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\775047583_4403206556599440_2517644785479075663_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\germany_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Germany white and black-red-gold flame gradient eagle wing shoulders 24/25 Euro football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed micro-knit fabric texture, realistic cloth physics and subtle folds, crisp 3D DFB German Eagle crest badge with four golden championship stars with tactile relief, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "italy-24-25-home-azzurri",
        "name": "Italy 24/25 Home Azzurri Tribute",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\775213155_2521368238366808_2393430064230996460_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\italy_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Italy classic Azzurri royal blue with Italian tricolor shoulder stripes 24/25 home football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle Mediterranean blue rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed tactile pique fabric texture, realistic cloth physics and subtle folds, crisp 3D FIGC Italian shield crest badge with four gold championship stars with tactile relief, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "spain-24-25-home-champions",
        "name": "Spain 24/25 Home Champions Euro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\778868049_1410301461164806_1449086068229551598_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\spain_home.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Spain vibrant scarlet red with subtle carnation floral wave texture and yellow collar trim 24/25 Euro football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed carnation wave jacquard texture, realistic cloth physics and subtle folds, crisp 3D Spanish RFEF shield crest badge with tactile relief and gold star, premium apparel commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "fc-barcelona-1999-centenary-retro",
        "name": "FC Barcelona 1999 Centenary Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\779944167_2125154005045102_6899841975409827797_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\barca_retro99.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact FC Barcelona 1999 Centenary half deep navy and half garnet red split retro football jersey with central crest and 1899-1999 commemorative dates based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed vintage heavyweight knit fabric texture, realistic cloth physics and subtle folds, crisp 3D central Barca shield crest with golden embroidery, polo collar, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "manchester-united-1999-treble-retro",
        "name": "Manchester United 1999 Treble Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\779944168_1534645231319967_662599299945427265_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\manutd_retro99.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Manchester United 1999 Treble Winners Camp Nou red football jersey with iconic zip-neck collar and black-white trim based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle crimson rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed retro polyester pique weave texture, realistic cloth physics and subtle folds, crisp 3D Red Devil Manchester United crest badge with tactile relief, Sharp chest sponsor, zip collar, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "real-madrid-2002-centenary-retro",
        "name": "Real Madrid 2002 Centenary Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\780226236_1769072344510551_4788597346539924595_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\realmadrid_retro02.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Real Madrid 2002 Centenary Zidane Glasgow Volley pure white and navy trim retro football jersey based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed tactile micro-pique fabric texture, realistic cloth physics and subtle folds, crisp 3D Real Madrid 1902-2002 Centenary anniversary crest badge with tactile relief, clean sponsorless or Siemens look, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "ac-milan-2007-athens-final-retro",
        "name": "AC Milan 2007 Athens Final Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\783109060_1412125107512000_5745972351448289094_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\acmilan_retro07.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact AC Milan 2007 Athens Champions League Final lucky pure white and Rossoneri shoulder stripes retro football jersey with Bwin sponsor based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle silver-golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed Climacool vintage weave texture, realistic cloth physics and subtle folds, crisp 3D AC Milan crest badge with star with tactile relief, Bwin sponsor, Champions League final match embroidery, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "arsenal-2005-06-highbury-redcurrant-retro",
        "name": "Arsenal 2005/06 Highbury Redcurrant Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\783424063_1090673203537437_8406940276554436861_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\arsenal_retro06.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Arsenal 2005/06 Highbury Farewell Redcurrant maroon and shimmering gold retro football jersey with O2 sponsor based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden-maroon rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed Highbury commemorative pique fabric texture, realistic cloth physics and subtle folds, crisp 3D gold embroidered Arsenal shield crest badge with tactile relief, O2 chest sponsor, Highbury 1913-2006 lower text, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "juventus-2002-03-fastweb-retro",
        "name": "Juventus 2002/03 Fastweb Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\785200332_1414302457285634_6852182476924215220_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\juventus_retro03.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Juventus 2002/03 Scudetto Champions classic black and white stripes retro football jersey with Fastweb sponsor based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed vintage micro-knit fabric texture, realistic cloth physics and subtle folds, crisp 3D Juventus oval crest badge with two golden championship stars with tactile relief, Fastweb sponsor, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    },
    {
        "slug": "brazil-2002-world-cup-penta-retro",
        "name": "Brazil 2002 World Cup Penta Retro",
        "ref": r"D:\AntigravityProjects\j2\public\jerseys\769251426_1598441991797327_2508726315705436612_n.jpg",
        "output": r"D:\AntigravityProjects\j2\public\jerseys_3d\brazil_retro02.jpg",
        "prompt": "A high-end 3D-style cinematic render of this exact Brazil 2002 Yokohama World Cup Penta Champions vibrant yellow and green curved mesh panels retro football jersey with four/five stars based on the reference image. The jersey is floating majestically in mid-air in an invisible mannequin pose, centered against a dark, moody cinematic atmospheric stadium background with subtle golden rim lighting. Unreal Engine 5 octane render aesthetic, hyper-detailed dual-layer Total 90 micro-mesh fabric texture, realistic cloth physics and subtle folds, crisp 3D CBF Brazil crest badge with tactile relief, iconic green curved side vent panels, premium vintage sportswear commercial product photography, 8k resolution, photorealistic masterpiece."
    }
]

def main():
    print(f"Starting batch render for {len(REMAINING_JERSEYS)} jerseys via Google Flow...\n")

    max_rounds = 4
    for round_num in range(1, max_rounds + 1):
        pending = [j for j in REMAINING_JERSEYS if not (os.path.exists(j["output"]) and os.path.getsize(j["output"]) > 10000)]
        if not pending:
            print("All jerseys successfully rendered!")
            break

        print(f"\n--- Starting Pass {round_num}/{max_rounds} ({len(pending)} jerseys pending) ---\n")

        for idx, item in enumerate(REMAINING_JERSEYS, 1):
            name = item["name"]
            ref_path = item["ref"]
            out_path = item["output"]
            prompt = item["prompt"]

            if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
                continue

            print(f"[{idx}/{len(REMAINING_JERSEYS)}] Generating 3D render for {name}...")

            cmd = [
                PYTHON_EXE,
                MAIN_PY,
                "image",
                prompt,
                "--ref", ref_path,
                "--aspect", "portrait",
                "--output", out_path
            ]

            try:
                start_time = time.time()
                res = subprocess.run(cmd, cwd=FLOW_DIR, capture_output=True, text=True, timeout=120)
                elapsed = time.time() - start_time

                if res.returncode == 0 and os.path.exists(out_path):
                    file_size_kb = os.path.getsize(out_path) / 1024
                    print(f"  [OK] SUCCESS ({elapsed:.1f}s) -> {os.path.basename(out_path)} ({file_size_kb:.1f} KB)")
                else:
                    err_msg = res.stderr.strip() or res.stdout.strip()
                    print(f"  [FAIL] FAILED ({elapsed:.1f}s): {err_msg[:120]}")
            except Exception as e:
                print(f"  [FAIL] ERROR: {str(e)[:120]}")

            # 6-second throttle for clean token refresh
            time.sleep(6)

        time.sleep(10)

    total_done = sum(1 for j in REMAINING_JERSEYS if os.path.exists(j["output"]) and os.path.getsize(j["output"]) > 10000)
    print("\n==========================================")
    print(f"Batch Render Complete! Successfully rendered {total_done}/{len(REMAINING_JERSEYS)} jerseys.")
    print("==========================================")

if __name__ == "__main__":
    main()
