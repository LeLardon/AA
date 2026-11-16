
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener
from pathlib import Path

# Enregistrer le décodeur HEIC / HEIF
register_heif_opener()

DOSSIER_SOURCE = Path("images")

# Qualité WebP -> à réduire pour diminuer la taille des fichiers si erreur de compilation GitHub Pages
QUALITE = 85

EXTENSIONS = [
    ".jpg", ".jpeg", ".png",
    ".heic", ".heif"
]

for fichier in DOSSIER_SOURCE.rglob("*"):

    if not fichier.is_file():
        continue

    if fichier.suffix.lower() not in EXTENSIONS:
        continue

    destination = fichier.with_suffix(".webp")

    try:
        # Ouvrir l'image
        with Image.open(fichier) as image:

            image.load()

            # Corriger l'orientation EXIF
            image = ImageOps.exif_transpose(image)

            # Conserver la transparence
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGB")

            # Créer le WebP dans un fichier temporaire
            temporaire = destination.with_name(
                destination.stem + "_temp.webp"
            )

            image.save(
                temporaire,
                "WEBP",
                quality=QUALITE,
                method=6
            )

        # Vérifier le fichier créé
        with Image.open(temporaire) as test:
            test.verify()

        # Remplacer l'ancien WebP si nécessaire
        temporaire.replace(destination)

        # Supprimer l'original uniquement après validation
        fichier.unlink()

        print(f"OK : {fichier} -> {destination}")

    except Exception as erreur:
        print(f"ERREUR : {fichier} : {erreur}")

        # Nettoyer le fichier temporaire en cas d'échec
        if 'temporaire' in locals() and temporaire.exists():
            temporaire.unlink()

print("\nConversion terminée !")
