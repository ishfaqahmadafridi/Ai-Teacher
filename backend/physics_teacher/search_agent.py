import urllib.request
import urllib.parse
import json
import logging

logger = logging.getLogger(__name__)

FALLBACK_IMAGES = {
    "gravity": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Mass_and_gravity_well.jpg",
    "orbit": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Mass_and_gravity_well.jpg",
    "projectile": "https://upload.wikimedia.org/wikipedia/commons/2/21/ParabolicWaterTrajectory.jpg",
    "motion": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Jet_propelled_cart_newton.jpg",
    "kinematics": "https://upload.wikimedia.org/wikipedia/commons/2/21/ParabolicWaterTrajectory.jpg",
    "wave": "https://upload.wikimedia.org/wikipedia/commons/4/40/Wave_packet.png",
    "sound": "https://upload.wikimedia.org/wikipedia/commons/3/35/Ondes_compression_refraction.gif",
    "light": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Prism_rainbow_schematic.svg",
    "circuit": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Simple_circuit_wiring.svg",
    "current": "https://upload.wikimedia.org/wikipedia/commons/d/da/Electric_circuit_with_battery_and_bulb.svg",
    "electricity": "https://upload.wikimedia.org/wikipedia/commons/d/da/Electric_circuit_with_battery_and_bulb.svg",
    "atom": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bohr_model_oxygen.svg",
    "nuclear": "https://upload.wikimedia.org/wikipedia/commons/3/36/Rutherford_atom.svg",
    "quantum": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Photoelectric_effect.svg",
    "electric_field": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Electric_field_positive_negative_charges.svg",
    "magnetic": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Magnetic_field_by_magnet.svg",
    "magnetism": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Magnetic_field_by_magnet.svg",
    "thermodynamics": "https://upload.wikimedia.org/wikipedia/commons/2/23/Ideal_gas_piston.svg",
    "heat": "https://upload.wikimedia.org/wikipedia/commons/2/23/Ideal_gas_piston.svg",
    "optics": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Refraction_in_glass_block.svg",
    "lens": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Lens_conjugate_points.svg",
    "mirror": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mirror_formula_derivation.svg",
    "force": "https://upload.wikimedia.org/wikipedia/commons/b/be/Newtonian_force_composition.svg",
    "newton": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Sir_Isaac_Newton_by_Sir_Godfrey_Kneller%2C_Bt.jpg",
    "friction": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Friction_diagram.svg",
    "default": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Blackboard_with_physics_equations.jpg"
}

def get_fallback_image(query: str) -> str:
    query_lower = query.lower()
    for key, url in FALLBACK_IMAGES.items():
        if key in query_lower:
            return url
    return FALLBACK_IMAGES["default"]

def search_wikipedia(query: str, limit: int = 2):
    """
    Search Wikipedia for the given query, returning text summaries and main page image URLs.
    Guarantees at least one valid diagram image URL is always returned.
    """
    if not query:
        return []

    # Clean query
    query = query.strip()
    
    # User-Agent header is required by Wikimedia API policies
    headers = {
        'User-Agent': 'AITeacherBot/1.0 (contact@aiteacher.org; educational AI project)'
    }
    
    # Step 1: Search Wikipedia for matching article titles
    search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json&utf8=1"
    
    results = []
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            search_results = data.get('query', {}).get('search', [])
            
            if search_results:
                # Extract top titles
                titles = [item['title'] for item in search_results[:limit]]
                logger.info(f"[SearchAgent] Top Wikipedia matches: {titles}")
                
                for title in titles:
                    # Step 2: Query detail for each title (intro extract + page image)
                    detail_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&piprop=original&exintro&explaintext&titles={urllib.parse.quote(title)}&format=json"
                    try:
                        req_detail = urllib.request.Request(detail_url, headers=headers)
                        with urllib.request.urlopen(req_detail, timeout=5) as resp_detail:
                            detail_data = json.loads(resp_detail.read().decode('utf-8'))
                            pages = detail_data.get('query', {}).get('pages', {})
                            for page_id, page_info in pages.items():
                                extract = page_info.get('extract', '')
                                img_url = page_info.get('original', {}).get('source', '')
                                
                                # Keep extract reasonably concise for LLM context
                                short_extract = extract[:600] + '...' if len(extract) > 600 else extract
                                
                                results.append({
                                    'title': title,
                                    'extract': short_extract,
                                    'image_url': img_url
                                })
                    except Exception as detail_err:
                        logger.warning(f"[SearchAgent] Failed to fetch details for page '{title}': {detail_err}")
                        
    except Exception as search_err:
        logger.error(f"[SearchAgent] Search error for query '{query}': {search_err}")

    # Ensure we always have at least one image URL available in the results
    has_image = any(item.get('image_url') for item in results)
    if not has_image:
        fallback_url = get_fallback_image(query)
        if results:
            results[0]['image_url'] = fallback_url
            logger.info(f"[SearchAgent] Attached fallback image to top Wikipedia result: {fallback_url}")
        else:
            results.append({
                'title': 'Physics Concept',
                'extract': "Let's explore this physics concept on the chalkboard.",
                'image_url': fallback_url
            })
            logger.info(f"[SearchAgent] Created dummy result with fallback image: {fallback_url}")

    return results
