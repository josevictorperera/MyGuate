import pandas as pd
import os
import re
from bs4 import BeautifulSoup

# --- 1. Configuration ---
CSV_FILE = 'products_export.csv'
OUTPUT_DIR = '_products'

# --- 2. Helper Functions ---

def clean_html(raw_html):
    """Parses raw HTML and returns clean text content."""
    if pd.isna(raw_html):
        return ""
    # Use BeautifulSoup to parse the HTML and extract only the text
    soup = BeautifulSoup(raw_html, 'html.parser')
    return soup.get_text(separator=' ', strip=True)

def slugify(text):
    """Converts text to a URL-safe slug (e.g., 'My Product' -> 'my-product')."""
    text = str(text).lower()
    text = re.sub(r'[\s]+', '-', text) 
    text = re.sub(r'[^\w\-]', '', text) 
    return text.strip('-')

# --- 3. Main Script Execution ---

if __name__ == '__main__':
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Load the CSV file. Assuming it's separated by comma, as is standard.
    try:
        # NOTE: If your CSV is semicolon-delimited, change delimiter=';' here
        df = pd.read_csv(
            CSV_FILE,
            encoding='utf-8',
            sep=',',
            quotechar='"',
            escapechar='\\',
            engine='python',
            on_bad_lines='skip'
        )
    except Exception as e:
        print(f"ERROR loading CSV: {e}")
        exit()

    REQUIRED_COLUMNS = ['Nombre', 'Descripción', 'Imágenes', 'Precio', 'SKU']
    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            print(f"ERROR: Missing crucial column '{col}' in the CSV file.")
            exit()

    files_generated = 0
    
    # Iterate through each row and create the Jekyll file
    for index, row in df.iterrows():
        
        # --- Data Mapping and Cleaning ---
        product_name = str(row['Nombre']).strip()
        
        if not product_name:
            print(f"Skipping row {index}: 'Nombre' is empty.")
            continue

        # 1. Product Filenames and Permalinks
        slug = slugify(product_name)
        filename = os.path.join(OUTPUT_DIR, f"{slug}.md")
        
        # 2. Clean Descriptions
        short_desc = clean_html(row.get('Descripción corta', ''))
        full_desc = clean_html(row['Descripción'])
        
        # 3. Image Path (Simplified Direct Use from CSV)
        # Gets the first path, strips whitespace
        image_path_raw = str(row['Imágenes']).split(',')[0].strip()

        # Final check before using the path
        if image_path_raw and image_path_raw.startswith('/assets/images/products/'):
            final_image_path = image_path_raw
        else:
            # This will only be triggered if the CSV cell is empty or the path is incorrect
            print(f"Warning: Product {product_name} has invalid image path: '{image_path_raw}'. Using placeholder.")
            final_image_path = "/assets/images/placeholder.jpg"
            
        # 4. Escape title for YAML Front Matter
        escaped_title = product_name.replace('"', '\\"')

        # --- 5. Final Content String ---
        content = f"""---
layout: product
permalink: /products/{slug}/
title: "{escaped_title}"
price: {row['Precio']}
sku: "{row['SKU']}"
image: "{final_image_path}"
alt_text: "{product_name} product image"
category: "{str(row.get('Categorías', ''))}"
---

## Descripción Corta

{short_desc}

## Descripción Detallada

{full_desc}

"""
        # 6. Write the file
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            files_generated += 1
        except Exception as e:
            print(f"ERROR writing file {filename}: {e}")
    
    # --- 7. Final Output ---
    print(f"\n✅ Successfully generated {files_generated} product files in {OUTPUT_DIR}/\n")