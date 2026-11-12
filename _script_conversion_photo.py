
from PIL import Image
from pathlib import Path

# Dossier principal
DOSSIER_SOURCE = Path("images")

# Qualité WebP -> à réduire pour diminuer la taille des fichiers si erreur de compilation GitHub Pages
QUALITE = 85

# Parcours récursif des images
for fichier in DOSSIER_SOURCE.rglob("*"):

    if fichier.is_file() and fichier.suffix.lower() in [".jpg", ".jpeg"]:

        destination = fichier.with_suffix(".webp")

        try:
            with Image.open(fichier) as image:

                # Conversion du mode colorimétrique
                if image.mode not in ("RGB", "RGBA"):
                    image = image.convert("RGB")

                # Conversion WebP
                image.save(
                    destination,
                    "WEBP",
                    quality=QUALITE,
                    method=6
                )

            # Vérifier que le fichier WebP existe
            if destination.exists() and destination.stat().st_size > 0:

                # Supprimer l'original
                fichier.unlink()

                print(f"OK : {fichier} -> {destination}")

        except Exception as erreur:
            print(f"ERREUR : {fichier} : {erreur}")

print("\nConversion et remplacement terminés !")
