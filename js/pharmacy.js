/* ============================================================
   HEALTHPLUS PHARMACY
   File: js/pharmacy.js
   Purpose: All JavaScript for order-online.html (pharmacy page).
            Covers: medicine database, live search, cart management,
            quantity steppers, order form submission, Leaflet
            live-tracking map, and rider chat window.
   Depends on: js/core.js, js/payment.js, Leaflet CDN
   Loaded: order-online.html only.
   ============================================================ */


/* ============================================================
   MEDICINE DATABASE
   500+ real medicines grouped by clinical category.
   Each entry has: name, cat (category), desc (description),
   price (GHS), img (Unsplash URL).
   The search function queries name, cat, and desc.
   ============================================================ */
var MEDICINES = [
  /* ============================================================
     CURATED FEATURED MEDICINES (common OTC + prescription items)
     ============================================================ */
  { name:'Paracetamol 500mg', cat:'Analgesic', desc:'Relieves mild to moderate pain and reduces fever. Suitable for adults and children.', price:15.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Paracetamol 1000mg', cat:'Analgesic', desc:'Extra-strength paracetamol for severe pain and high fever.', price:22.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Ibuprofen 400mg', cat:'NSAID', desc:'Anti-inflammatory for headaches, muscle pain and joint pain.', price:28.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Ibuprofen 600mg', cat:'NSAID', desc:'Higher-dose ibuprofen for moderate to severe inflammatory pain.', price:35.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Aspirin 75mg', cat:'Analgesic', desc:'Low-dose aspirin for cardiovascular protection and blood thinning.', price:18.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Aspirin 300mg', cat:'Analgesic', desc:'Standard aspirin for pain, fever and inflammation.', price:20.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Diclofenac 50mg', cat:'NSAID', desc:'Powerful anti-inflammatory for arthritis, back pain and sports injuries.', price:40.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Naproxen 500mg', cat:'NSAID', desc:'Long-acting NSAID for period pain, arthritis and muscle pain.', price:45.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Tramadol 50mg', cat:'Opioid Analgesic', desc:'Prescription opioid for moderate to severe pain. Requires valid prescription.', price:60.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Codeine 30mg', cat:'Opioid Analgesic', desc:'Mild opioid for pain and dry cough. Prescription required.', price:55.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Amoxicillin 250mg', cat:'Antibiotic', desc:'Broad-spectrum antibiotic for respiratory, ear and urinary tract infections.', price:30.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Amoxicillin 500mg', cat:'Antibiotic', desc:'Standard adult dose antibiotic for bacterial infections.', price:38.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Amoxicillin-Clavulanate 625mg', cat:'Antibiotic', desc:'Augmented amoxicillin for resistant bacterial infections.', price:75.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Azithromycin 250mg', cat:'Antibiotic', desc:'Macrolide antibiotic for chest infections, chlamydia and typhoid.', price:65.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Azithromycin 500mg', cat:'Antibiotic', desc:'Higher dose macrolide antibiotic for severe infections.', price:85.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Ciprofloxacin 250mg', cat:'Antibiotic', desc:'Fluoroquinolone for urinary, GI and bone infections.', price:50.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Ciprofloxacin 500mg', cat:'Antibiotic', desc:'Standard-dose ciprofloxacin for serious bacterial infections.', price:70.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Doxycycline 100mg', cat:'Antibiotic', desc:'Tetracycline for malaria prevention, acne and STIs.', price:55.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Metronidazole 200mg', cat:'Antibiotic', desc:'Antiprotozoal and antibacterial for gut infections and STIs.', price:25.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Metronidazole 400mg', cat:'Antibiotic', desc:'Higher dose metronidazole for serious anaerobic infections.', price:35.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Erythromycin 250mg', cat:'Antibiotic', desc:'Macrolide antibiotic suitable for penicillin-allergic patients.', price:42.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Clindamycin 150mg', cat:'Antibiotic', desc:'For skin infections, bone infections and dental abscesses.', price:80.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Trimethoprim 200mg', cat:'Antibiotic', desc:'For uncomplicated urinary tract infections.', price:32.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Artemether-Lumefantrine (Coartem)', cat:'Antimalarial', desc:'First-line treatment for uncomplicated malaria in Ghana.', price:55.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Artesunate 50mg', cat:'Antimalarial', desc:'Injectable and oral artesunate for severe malaria.', price:90.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Chloroquine 150mg', cat:'Antimalarial', desc:'Classic antimalarial — also used for autoimmune conditions.', price:28.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Quinine 300mg', cat:'Antimalarial', desc:'For severe and complicated malaria cases.', price:65.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Proguanil 100mg', cat:'Antimalarial', desc:'Malaria prophylaxis, often combined with chloroquine for travel.', price:48.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Fluconazole 150mg', cat:'Antifungal', desc:'Single-dose treatment for vaginal thrush and oral candidiasis.', price:45.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Clotrimazole Cream 1%', cat:'Antifungal', desc:'Topical antifungal for athlete\'s foot, ringworm and skin candida.', price:30.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Ketoconazole Shampoo', cat:'Antifungal', desc:'Medicated shampoo for dandruff, seborrhoea and scalp fungal infections.', price:55.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Itraconazole 100mg', cat:'Antifungal', desc:'Systemic antifungal for nail, skin and lung fungal infections.', price:120.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Mebendazole 100mg', cat:'Antiparasitic', desc:'Deworming treatment for roundworm, hookworm and whipworm.', price:20.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Albendazole 400mg', cat:'Antiparasitic', desc:'Broad-spectrum antiparasitic for intestinal worms.', price:25.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Ivermectin 6mg', cat:'Antiparasitic', desc:'For river blindness, strongyloidiasis and scabies.', price:60.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Acyclovir 200mg', cat:'Antiviral', desc:'For herpes simplex, shingles and chickenpox.', price:80.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Oseltamivir (Tamiflu) 75mg', cat:'Antiviral', desc:'Antiviral for influenza A and B — best started within 48 hours of symptoms.', price:150.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Amlodipine 5mg', cat:'Antihypertensive', desc:'Calcium channel blocker for high blood pressure and angina.', price:35.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Amlodipine 10mg', cat:'Antihypertensive', desc:'Higher dose for blood pressure not controlled on 5mg.', price:45.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril 5mg', cat:'ACE Inhibitor', desc:'ACE inhibitor for hypertension and heart failure.', price:30.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Lisinopril 10mg', cat:'ACE Inhibitor', desc:'Standard dose lisinopril for blood pressure management.', price:40.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Atenolol 50mg', cat:'Beta Blocker', desc:'Beta blocker for hypertension, angina and heart rate control.', price:28.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Atenolol 100mg', cat:'Beta Blocker', desc:'Higher dose beta blocker for severe hypertension.', price:38.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Losartan 50mg', cat:'ARB', desc:'Angiotensin receptor blocker for hypertension and kidney protection in diabetes.', price:55.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Hydrochlorothiazide 25mg', cat:'Diuretic', desc:'Thiazide diuretic for hypertension and fluid retention.', price:22.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Furosemide 40mg', cat:'Diuretic', desc:'Loop diuretic for heart failure and oedema.', price:25.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Atorvastatin 10mg', cat:'Statin', desc:'Lowers LDL cholesterol and reduces cardiovascular risk.', price:60.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atorvastatin 20mg', cat:'Statin', desc:'Standard dose statin for high cholesterol.', price:75.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Simvastatin 20mg', cat:'Statin', desc:'Widely used statin for cholesterol reduction.', price:50.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Warfarin 5mg', cat:'Anticoagulant', desc:'Blood thinner for DVT, PE and atrial fibrillation. Requires monitoring.', price:30.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Metformin 500mg', cat:'Antidiabetic', desc:'First-line oral diabetes medication for type 2 diabetes.', price:25.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Metformin 1000mg', cat:'Antidiabetic', desc:'High dose metformin for better blood sugar control.', price:35.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Glibenclamide 5mg', cat:'Antidiabetic', desc:'Sulfonylurea that stimulates insulin release for type 2 diabetes.', price:20.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Insulin Regular 100IU/ml', cat:'Insulin', desc:'Short-acting insulin for blood sugar control. Requires refrigeration.', price:180.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Insulin Glargine (Lantus)', cat:'Insulin', desc:'Long-acting basal insulin for once-daily dosing.', price:250.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Salbutamol Inhaler 100mcg', cat:'Bronchodilator', desc:'Reliever inhaler for asthma and COPD. Fast-acting bronchodilator.', price:65.0, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Beclomethasone Inhaler 100mcg', cat:'Corticosteroid Inhaler', desc:'Preventer inhaler for asthma — reduces airway inflammation.', price:85.0, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Prednisolone 5mg', cat:'Corticosteroid', desc:'Oral steroid for asthma flare-ups, allergies and inflammation.', price:30.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Cetirizine 10mg', cat:'Antihistamine', desc:'Non-drowsy antihistamine for allergic rhinitis, urticaria and hay fever.', price:20.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Loratadine 10mg', cat:'Antihistamine', desc:'24-hour allergy relief without drowsiness.', price:22.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Chlorpheniramine 4mg', cat:'Antihistamine', desc:'Classic antihistamine for allergies, colds and itching.', price:15.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Omeprazole 20mg', cat:'Proton Pump Inhibitor', desc:'Reduces stomach acid for GERD, ulcers and heartburn.', price:40.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Omeprazole 40mg', cat:'Proton Pump Inhibitor', desc:'Higher dose omeprazole for severe acid reflux and H. pylori treatment.', price:55.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Loperamide 2mg', cat:'Antidiarrhoeal', desc:'Slows gut movement to control acute diarrhoea.', price:22.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'ORS Sachets', cat:'Rehydration', desc:'Oral rehydration salts for dehydration from diarrhoea and vomiting.', price:18.0, img:'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80' },
  { name:'Zinc Sulfate 20mg', cat:'Supplement', desc:'Used alongside ORS for diarrhoea management in children.', price:20.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Bisacodyl 5mg', cat:'Laxative', desc:'Stimulant laxative for constipation.', price:18.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Metoclopramide 10mg', cat:'Antiemetic', desc:'For nausea, vomiting and gastric reflux.', price:25.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ondansetron 4mg', cat:'Antiemetic', desc:'Highly effective antiemetic for chemotherapy and post-op nausea.', price:70.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Antacid Tablets', cat:'Antacid', desc:'Calcium carbonate chewable tablets for immediate heartburn relief.', price:12.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Vitamin C 1000mg', cat:'Supplement', desc:'High-dose vitamin C for immune support and antioxidant protection.', price:22.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Vitamin D3 1000IU', cat:'Supplement', desc:'Supports bone health, immune function and mood.', price:35.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Vitamin D3 5000IU', cat:'Supplement', desc:'High-dose vitamin D for deficiency correction.', price:55.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Vitamin B Complex', cat:'Supplement', desc:'Complete B vitamin complex for energy, nerves and metabolism.', price:30.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Folic Acid 400mcg', cat:'Supplement', desc:'Essential during pregnancy for neural tube defect prevention.', price:18.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Iron Sulfate 200mg', cat:'Supplement', desc:'For iron-deficiency anaemia.', price:22.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Calcium Carbonate 500mg', cat:'Supplement', desc:'Bone-building calcium supplement.', price:28.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Omega-3 Fish Oil 1000mg', cat:'Supplement', desc:'Supports heart, brain and joint health.', price:65.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Multivitamin Daily', cat:'Supplement', desc:'Complete daily multivitamin for men and women.', price:40.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Zinc 10mg', cat:'Supplement', desc:'Immune support and wound healing.', price:22.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Fluoxetine 20mg', cat:'SSRI', desc:'SSRI antidepressant for depression, OCD and anxiety.', price:55.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Sertraline 50mg', cat:'SSRI', desc:'Antidepressant for depression, PTSD and social anxiety.', price:60.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Amitriptyline 25mg', cat:'Antidepressant', desc:'Tricyclic antidepressant also used for chronic pain and migraines.', price:30.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Diazepam 5mg', cat:'Benzodiazepine', desc:'For anxiety, muscle spasm and alcohol withdrawal. Prescription required.', price:30.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Carbamazepine 200mg', cat:'Anticonvulsant', desc:'For epilepsy, bipolar disorder and trigeminal neuralgia.', price:40.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Melatonin 3mg', cat:'Sleep Aid', desc:'Natural hormone for sleep disorders and jet lag.', price:50.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Combined OCP (Microgynon)', cat:'Contraceptive', desc:'Combined oral contraceptive pill for pregnancy prevention.', price:30.0, img:'https://images.unsplash.com/photo-1575879711582-0024b37f2bfa?w=500&q=80' },
  { name:'Emergency Contraceptive Pill', cat:'Contraceptive', desc:'Morning-after pill to prevent pregnancy after unprotected sex.', price:25.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Levothyroxine 50mcg', cat:'Thyroid Hormone', desc:'For hypothyroidism — replaces low thyroid hormone.', price:35.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Levothyroxine 100mcg', cat:'Thyroid Hormone', desc:'Maintenance dose for established hypothyroidism.', price:50.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Hydrocortisone Cream 1%', cat:'Topical Steroid', desc:'Mild corticosteroid for eczema, rashes and insect bites.', price:25.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Betamethasone Cream 0.1%', cat:'Topical Steroid', desc:'Potent steroid cream for severe eczema and psoriasis.', price:40.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Calamine Lotion', cat:'Topical', desc:'Soothing lotion for chickenpox, sunburn and itchy skin.', price:18.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Benzoyl Peroxide Gel 5%', cat:'Acne Treatment', desc:'Topical gel for mild to moderate acne.', price:45.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Permethrin Cream 5%', cat:'Antiparasitic', desc:'Topical treatment for scabies and lice.', price:55.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Chloramphenicol Eye Drops', cat:'Ophthalmic', desc:'Antibiotic eye drops for bacterial conjunctivitis.', price:22.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Gentamicin Eye Drops', cat:'Ophthalmic', desc:'Broad-spectrum antibiotic eye drops.', price:28.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Xylometazoline Nasal Spray', cat:'Decongestant', desc:'Fast-acting nasal decongestant for blocked nose.', price:25.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Iodine Solution 10%', cat:'First Aid', desc:'Antiseptic for wound cleaning and skin disinfection.', price:15.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Hydrogen Peroxide 3%', cat:'First Aid', desc:'Mild antiseptic for cuts and wound cleaning.', price:12.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Bandage Roll 5cm', cat:'First Aid', desc:'Crepe bandage for wound dressing and support.', price:8.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Plasters / Bandaids (20)', cat:'First Aid', desc:'Adhesive plasters for minor cuts and grazes.', price:12.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Medical Gloves (Box 100)', cat:'First Aid', desc:'Latex-free examination gloves.', price:45.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Digital Thermometer', cat:'Medical Device', desc:'Fast-reading digital thermometer for oral or axillary use.', price:55.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Blood Pressure Monitor', cat:'Medical Device', desc:'Automatic upper-arm BP monitor for home monitoring.', price:280.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Blood Glucose Monitor', cat:'Medical Device', desc:'Complete starter kit with lancets and test strips.', price:220.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Pulse Oximeter', cat:'Medical Device', desc:'Fingertip pulse oximeter for SpO2 and heart rate.', price:150.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Hand Sanitizer 500ml', cat:'Hygiene', desc:'70% alcohol hand sanitizer gel.', price:25.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Pregnacare Prenatal', cat:'Maternal Health', desc:'Complete prenatal vitamin with folic acid, iron and DHA.', price:95.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },
  { name:'Ferrous Sulfate 200mg', cat:'Maternal Health', desc:'Iron supplement during pregnancy to prevent anaemia.', price:20.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Sildenafil 50mg', cat:'Men\'s Health', desc:'For erectile dysfunction. Prescription required.', price:90.0, img:'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80' },
  { name:'Finasteride 5mg', cat:'Men\'s Health', desc:'For benign prostatic hyperplasia and male pattern baldness.', price:75.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Tamsulosin 0.4mg', cat:'Men\'s Health', desc:'Alpha blocker for benign prostatic hyperplasia.', price:65.0, img:'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80' },

  /* ============================================================
     CONTRACEPTIVES & SEXUAL WELLNESS
     ============================================================ */
  { name:'Progestin-Only Pill (POP)', cat:'Contraceptive', desc:'Mini-pill contraceptive suitable for breastfeeding mothers and those who cannot take oestrogen.', price:32.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Depo-Provera Injection (DMPA)', cat:'Contraceptive', desc:'Long-acting injectable contraceptive given every 3 months.', price:45.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Male Condoms (Pack of 3)', cat:'Contraceptive', desc:'Latex condoms for pregnancy and STI prevention. Lubricated for comfort.', price:10.0, img:'https://images.unsplash.com/photo-1573209946145-848669b5ef39?w=500&q=80' },
  { name:'Male Condoms (Pack of 12)', cat:'Contraceptive', desc:'Value pack of lubricated latex condoms for pregnancy and STI prevention.', price:35.0, img:'https://images.unsplash.com/photo-1573209946145-848669b5ef39?w=500&q=80' },
  { name:'Female Condoms (Pack of 3)', cat:'Contraceptive', desc:'Internal condoms offering pregnancy and STI protection, inserted before intercourse.', price:28.0, img:'https://images.unsplash.com/photo-1573209946145-848669b5ef39?w=500&q=80' },
  { name:'Personal Lubricant Gel (Water-Based) 50ml', cat:'Lubricant', desc:'Water-based intimate lubricant, condom-safe and easy to clean up.', price:35.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Silicone-Based Lubricant 60ml', cat:'Lubricant', desc:'Long-lasting silicone lubricant for sensitive skin, safe with latex condoms.', price:48.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },

  /* ============================================================
     FULL NHIS MEDICINES LIST (%d items, grouped by category)
     Prices shown are HealthPlus retail prices; NHIS reference price
     and prescribing level are included in each item's description.
     ============================================================ */
  /* ── Analgesic ── */
  { name:'Codeine Tablet, 30 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Diclofenac Capsule, 75 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Diclofenac Gel (30 G)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:10.56, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Diclofenac Injection, 75mg/3mL (Ampoule)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Diclofenac Suppository, 50 mg (Supp.)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Diclofenac Suppository, 100 mg (Supp.)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Diclofenac Tablet, 25 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Diclofenac Tablet, 50 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Dihydrocodeine Tablet, 30 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ibuprofen Suspension, 100 mg/5 mL (100 mL)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Ibuprofen Tablet, 200 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ibuprofen Tablet, 400 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Mefenamic Acid Capsule, 250 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Mefenamic Acid Tablet, 500 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Morphine Injection, 10 mg/mL (Ampoule)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Morphine Injection, 10 mg/mL (Preservative Free) (Ampoule)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:44.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Morphine Sulphate Tablet, 10 mg (Slow Release)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Morphine Sulphate Tablet, 30 mg (Slow Release)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:16.1, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Paracetamol Suppository, 125 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Paracetamol Suppository, 250 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Paracetamol Suppository, 500 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Paracetamol Syrup, 120 mg/5 mL (125 mL)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:10.88, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Paracetamol Tablet, 500 mg', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Pethidine Injection, 50 mg/mL in 2 mL (Ampoule)', cat:'Analgesic', desc:'Analgesic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.48, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },

  /* ── Antibiotic ── */
  { name:'Amoxicillin + Clavulanic Acid Injection, 500 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:28.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Amoxicillin + Clavulanic Acid Injection, 1.2g (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:43.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Amoxicillin + Clavulanic Acid Suspension, 250 (70 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:41.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Amoxicillin + Clavulanic Acid Suspension, 400 (70 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:44.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Amoxicillin + Clavulanic Acid Tablet, 500 mg + 125 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amoxicillin + Clavulanic Acid Tablet, 875 mg + 125 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.3, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amoxicillin Capsule, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Amoxicillin Capsule, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Amoxicillin Suspension, 125 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Ampicillin Injection, 500 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Azithromycin Capsule, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Azithromycin Oral Suspension, 200 mg/5 (15 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:30.4, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Benzylpenicillin Injection, 1 MU (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Benzylpenicillin Injection, 5 MU (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Cefaclor Capsule, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Cefaclor Capsule, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:9.76, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Cefaclor Suspension, 125 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:40.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cefaclor Suspension, 250 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:56.16, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cefotaxime Injection, 500 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:32.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Cefotaxime Injection, 1 g (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:41.57, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ceftriazone Injection, 500 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ceftriazone Injection, 1g (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:21.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Cefuroxime Injection, 750 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:21.57, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Cefuroxime Suspension, 125 mg/5 mL (50mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:36.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cefuroxime Tablet, 125 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Cefuroxime Tablet, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5.12, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ciprofloxacin Eye Drops, 0.3% (10 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Ciprofloxacin Infusion, 2 mg/mL in 100 mL (Bottle)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:11.62, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ciprofloxacin Tablet, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ciprofloxacin Tablet, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ciprofloxacin + Tinidazole Tablet, 500 mg +', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Clarithromycin Capsule, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Clarithromycin Capsule, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Clarithromycin Paediatric Suspension, 125 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:72.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Clindamycin Capsule, 150 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Clindamycin Injection, 150 mg/mL in 2 mL (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:44.16, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Clindamycin Suspension, 75 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:117.44, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Clindamycin Topical Solution, 1% (30 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:144.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cloxacillin Injection, 250 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Cloxacillin Injection, 500 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Co-trimoxazole Suspension, (200+40) mg/5 (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cotrimoxazole Tablet, (400+80) mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Doxycycline Capsule, 100 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Erythromycin Syrup, 125 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Erythromycin Tablet, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Flucloxacillin Capsule, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Flucloxacillin Injection, 250 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Flucloxacillin Injection, 500 mg (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Flucloxacillin Suspension, 125 mg/5 mL (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Gentamicin Ear Drops, 0.3% (10mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Gentamicin Eye Drops, 0.3% (10 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Gentamicin Injection, 40 mg/mL in 2 mL (Ampoule)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Metronidazole Injection, 5 mg/mL in 100 mL (Bottle)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Metronidazole Suppository, 500 mg (Supp.)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Metronidazole Suspension, 100 mg/5 mL (as benzoate) (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Metronidazole Suspension, 200 mg/5 mL(as benzoate) (100 mL)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Metronidazole Tablet, 200 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Metronidazole Tablet, 400 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Neomycin Tablet, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:10.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Nitrofurantoin Tablet, 100 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5.76, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Phenoxymethyl Penicillin Tablet, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Procaine Benzylpenicillin Injection, 4 MU (Vial)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Secnidazole Tablet, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Tetracycline Capsule, 250 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Tetracycline Eye Ointment, 0.5% (5G)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Tetracycline Eye Ointment, 1% (5G)', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:6.08, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Tinidazole Capsule, 500 mg', cat:'Antibiotic', desc:'Antibiotic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:14.08, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },

  /* ── Antidiabetic ── */
  { name:'Glibenclamide Tablet, 5 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Gliclazide Tablet, 80 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Glimepiride Tablet, 1 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Glimepiride Tablet, 2 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Glimepiride Tablet, 3 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.3, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Glimepiride Tablet, 4 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Insulin premixed (30/70) HM Injection, 100 units/mL in 10 mL (Vial)', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:133.12, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Insulin Soluble HM, 100 units/mL in 10 mL (Vial)', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:203.84, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Isophane Insulin Injection (HM), 100 units/mL in 10 mL (Vial)', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:203.84, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Metformin Tablet, 500 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Pioglitazone Tablet, 15 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Pioglitazone Tablet, 30 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Tolbutamide Tablet, 500 mg', cat:'Antidiabetic', desc:'Antidiabetic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Antifungal ── */
  { name:'Clotrimazole + Hydrocortisone Cream, 1% + (15 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:13.73, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Clotrimazole Cream, 1% (15 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Clotrimazole Cream, 2% (15 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:13.76, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Clotrimazole Pessary, 100 mg (6 Pess.)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Clotrimazole Pessary, 200 mg (3 Pess.)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:16.06, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Clotrimazole Pessary, 500 mg (1 Pess.)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:21.92, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Fluconazole Capsule, 150 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:10.88, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Fluconazole Capsule, 200 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:12.48, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Fluconazole Suspension, 10 mg/mL (35 mL)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Fluconazole Suspension, 50 mg/5 mL (35 mL)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:25.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Fluconazole Tablet, 50 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Griseofulvin Suspension, 125 mg/5 mL (100 mL)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:24.48, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Griseofulvin Tablet, 125 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Griseofulvin Tablet, 500 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Itraconazole Capsule, 100 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Itraconazole Suspension, 10 mg/mL (30 mL)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:166.4, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Ketoconazole Cream, 30g (Tube)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:17.6, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Ketoconazole Tablet, 200 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Miconazole + Hydrocortisone Cream, 2% + 1% (15 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:22.4, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Miconazole Cream, 2% (15 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Miconazole Oral Gel, 25 mg/mL (40 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:96.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Miconazole Ovule, 400 mg (3 Ovules)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:35.49, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Nystatin Ointment, 100,000 IU (30 G)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:48.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Nystatin Pessary, 100,000 IU', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Nystatin Suspension, 100,000 IU/mL (15 mL)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:28.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Nystatin Tablet, 500,000 IU', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Selenium Sulphide Shampoo, 2.5% (50 mL)', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:41.92, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Tiabendazole Tablet, 500 mg', cat:'Antifungal', desc:'Antifungal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.8, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Antihistamine/Allergy ── */
  { name:'Cetirizine softgel Capsule, 10 mg', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Cetirizine Syrup, 5 mg/5 mL (30 mL)', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:10.24, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cetirizine Tablet, 10 mg', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Chlorphenamine Syrup, 2 mg/5 mL (100 mL)', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:9.86, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Chlorphenamine Tablet, 4 mg', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Promethazine Hydrochloride Elixir, 5 mg/5 mL (60 mL)', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Promethazine Hydrochloride Injection, 25 mg/mL in 2 mL (Ampoule)', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Promethazine Hydrochloride Tablet, 25 mg', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Promethazine Theoclate Tablet, 25 mg', cat:'Antihistamine/Allergy', desc:'Antihistamine/Allergy — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Antimalarial ── */
  { name:'Amodiaquine + Artesunate Granular Powder (Sachet)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80' },
  { name:'Amodiaquine + Artesunate Granular Powder, 150 mg + 50 mg (Sachet)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80' },
  { name:'Amodiaquine + Artesunate Tablet, 75 mg + 25 (1 Course)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amodiaquine + Artesunate Tablet, 150 mg + (1 Course)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Artemether + Lumefantrine Dispersible Tablet, 20 mg + 120 mg (6 Tablets)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Artemether + Lumefantrine Suspension, (Powder For Reconstitution) 20 m (100 mL)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:25.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Artemether + Lumefantrine Tablet, 20 mg + 120 mg (24’s) (1 Course)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Artesunate Injection, 30 mg (Vial)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:22.4, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Artesunate Injection, 60 mg (Vial)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:28.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Artesunate Suppository, 50 mg (Supp.)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Artesunate Suppository, 200 mg (Supp.)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:10.66, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Dihydroartemisin + Piperaquine Granular Powder, 10 mg + 80 mg (Sachet)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80' },
  { name:'Quinine Injection, 300 mg/mL in 2 mL (Ampoule)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.85, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Quinine Syrup, 75 mg/5 mL (125 mL)', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:27.2, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Quinine Tablet, 300 mg', cat:'Antimalarial', desc:'Antimalarial — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Antiparasitic/Anthelmintic ── */
  { name:'Albendazole Syrup, 100 mg/5 mL (20 mL)', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:7.55, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Albendazole Tablet, 200 mg', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Albendazole Tablet, 400 mg', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Mebendazole Suspension, 100 mg/5 mL (30 mL)', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Mebendazole Tablet, 100 mg (6 Tablets)', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5.76, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Mebendazole Tablet, 500 mg', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Praziquantel Tablet, 600 mg', cat:'Antiparasitic/Anthelmintic', desc:'Antiparasitic/Anthelmintic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Antiseptic ── */
  { name:'Benzoic Acid + Salicylic Acid Ointment, 6% + (25 G)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Cetrimide Solution (200 mL)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Chlorhexidine Cream, 1% (15 G)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Chlorhexidine Mouthwash, 0.2% (200 mL)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:19.58, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Chlorhexidine Solution, 2.5% (100 mL)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Povidone Iodine Aqueous Solution, 10% (100 mL)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:22.4, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Povidone Iodine Ointment, 10% (10 G)', cat:'Antiseptic', desc:'Antiseptic — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:13.44, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },

  /* ── Antiviral ── */
  { name:'Acyclovir Cream, 5% (5G)', cat:'Antiviral', desc:'Antiviral — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:30.4, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Acyclovir Eye Ointment, 3% (2G)', cat:'Antiviral', desc:'Antiviral — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:48.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Acyclovir Injection, 250 mg vial', cat:'Antiviral', desc:'Antiviral — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:166.4, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Acyclovir Suspension, 200 mg/5 mL (20 mL)', cat:'Antiviral', desc:'Antiviral — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:217.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Acyclovir Tablet, 200 mg', cat:'Antiviral', desc:'Antiviral — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5.12, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Blood/Anticoagulant ── */
  { name:'Dalteparin Sodium Injection, 5000 units/0.2 (Prefilled Syringe)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:112.67, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Enoxaparin Sodium Injection, 40 mg/0.4 mL (Prefilled Syringe)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:137.92, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Heparin Injection, 1000 units/mL in 5 mL (Ampoule)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:36.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Heparin Injection, 5000 units/mL in 1mL (Ampoule)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:32.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Heparin Injection, 5000 units/mL in 5 mL (Vial)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:84.64, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Phytomenadione Injection, 1 mg/mL (Ampoule)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:7.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Phytomenadione Injection, 10 mg/mL (Ampoule)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Protamine Sulphate Injection, 10 mg/mL in (5   Ampoule)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:160.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Streptokinase Injection, 100,000 unit-vial', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:27.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Streptokinase Injection, 250,000 unit-vial', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:352.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Streptokinase Injection, 750,000 unit-vial', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:576.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Tirofiban Infusion, 50 micrograms/mL (100 mL)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:864.03, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Tirofiban Infusion, 250 micrograms/ml (concentrate) (100 mL)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:1024.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Tranexamic Acid Capsule, 250 mg', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5.12, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Tranexamic Acid Injection, 500 mg/5mL (Ampoule)', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:27.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Tranexamic Acid Tablet, 500 mg', cat:'Blood/Anticoagulant', desc:'Blood/Anticoagulant — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.59, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Cardiovascular ── */
  { name:'Amlodipine Tablet, 5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amlodipine Tablet, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atenolol + Hydrochlorthiazide Tablet, 50 mg + 25 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atenolol + Hydrochlorthiazide Tablet, 100 mg + 25 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atenolol Injection, 500 microgram/10 mL (Ampoule)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:31.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Atenolol Tablet, 25 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atenolol Tablet, 50 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atenolol Tablet, 100 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atorvastatin Tablet, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Atorvastatin Tablet, 20 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Bendroflumethiazide Tablet, 2.5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Bendroflumethiazide Tablet, 5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Digoxin Elixir, 50 microgram/mL (60 mL)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:163.39, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Digoxin Tablet, 62.5 microgram', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Digoxin Tablet, 125 microgram', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Digoxin Tablet, 250 microgram', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Fluvastatin Capsule, 20 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:8.32, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Furosemide Injection, 10 mg/mL in 2 mL (Ampoule)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Furosemide Tablet, 40 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Glyceryl Trinitrate Sublingual Tablet, 500 microgram (100 Tablets)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:124.8, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Hydralazine Injection, 20 mg (Ampoule)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:71.36, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Hydralazine Tablet, 25 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Isosorbide Dinitrate Tablet, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Labetalol Injection, 5 mg/mL in 20 mL (Ampoule)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:224.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Labetalol Tablet, 100 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Labetalol Tablet, 200 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril + Hydrochlorthiazide Tablet, (10 mg + 12.5 mg)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril + Hydrochlorthiazide Tablet, (20 mg + 12.5 mg)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.08, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril Tablet, 2.5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril Tablet, 5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril Tablet, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lisinopril Tablet, 20 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Losartan Tablet, 25 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Losartan Tablet, 50 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Losartan Tablet, 100 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Methyldopa Tablet, 250 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Metolazone Tablet, 5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Nifedipine Capsule, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Nifedipine Tablet, 10 mg (slow release)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Nifedipine Tablet, 20 mg (slow release)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Nifedipine Tablet, 30 mg (GITS)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Propranolol Injection, 1 mg/mL in 1mL (Ampoule)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:6.56, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Propranolol Tablet, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Propranolol Tablet, 40 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Propranolol Tablet, 80 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ramipril Tablet, 2.5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ramipril Tablet, 5 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Simvastatin Tablet, 10 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Simvastatin Tablet, 20 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Simvastatin Tablet, 40 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Simvastatin Tablet, 80 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Spironolactone Tablet, 25 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Spironolactone Tablet, 50 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Verapamil Tablet, 40 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Verapamil Tablet, 80 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Warfarin Tablet, 1 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Warfarin Tablet, 3 mg', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Warfarin Tablet, 5 mg (scored)', cat:'Cardiovascular', desc:'Cardiovascular — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Corticosteroid ── */
  { name:'Betamethasone Valerate cream, 0.1% (15 G)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:34.98, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Clobetasol Propionate Cream, 0.05% (15 G)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Dexamethasone Eye Drops, 1% (5 mL)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:25.6, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Dexamethasone Eye Ointment, 1% (5G)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:16.8, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Dexamethasone Injection, 4 mg/mL (1mL)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dexamethasone Injection, 8 mg/2 mL (2mL)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dexamethasone Tablet, 500 microgram', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Fludrocortisone Tablet, 100 microgram', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Hydrocortisone Cream, 1% (15 G)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:18.4, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Hydrocortisone Eye Drops, 1% (5 mL)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:24.8, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Hydrocortisone Eye Ointment, 1% (5G)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Hydrocortisone Sodium Succinate Injection, 100 mg (Vial)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Prednisolone Eye Drops, 0.5% (10 mL)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:13.6, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Prednisolone Eye Drops, 1% (10 mL)', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:18.88, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Prednisolone Tablet, 5 mg', cat:'Corticosteroid', desc:'Corticosteroid — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Dermatological ── */
  { name:'Acetylsalicylic Acid Tablet, 300 mg', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Acetylsalicylic Acid Tablet, 75 mg (Dispersible)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Aqueous Cream BP (100 G)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:24.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Benzoyl Peroxide Cream, 5% (30 G)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:69.6, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Benzoyl Peroxide Cream, 10% (30 G)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:60.06, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Benzyl Benzoate Lotion, 25% (30mL)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:14.4, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Calamine Cream, 15% (40 G)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:10.72, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Calamine Lotion, 15% (200 mL)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Salicylic Acid Ointment, 2% (40G)', cat:'Dermatological', desc:'Dermatological — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },

  /* ── Emergency/Critical Care ── */
  { name:'Adrenaline Injection, 1 mg/1mL (1:1000) (1 mL)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Adrenaline Injection, 1:10,000 (Vial)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Atropine Eye Drops, 1% (10 mL)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:54.4, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Atropine Injection, 0.6 mg/mL (1 mL)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dopamine Injection, 40 mg/mL in 5 mL (Vial)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:65.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Doxapram Injection, 20 mg/mL in 5 mL (Vial)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:49.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Hyoscine Butylbromide Injection, 20 mg/ mL (1 mL)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Hyoscine Butylbromide Tablet, 10 mg', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Naloxone Injection, 400 microgram/mL in 1mL (Ampoule)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:36.16, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Neostigmine Bromide Tablet, 15 mg', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:22.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Neostigmine Injection, 2.5 mg/mL (Ampoule)', cat:'Emergency/Critical Care', desc:'Emergency/Critical Care — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:18.88, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },

  /* ── Gastrointestinal ── */
  { name:'Activated Charcoal Powder, 50 g', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:32.0, img:'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80' },
  { name:'Bisacodyl Tablet, 5 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Domperidone Tablet, 10 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Esomeprazole Capsule, 20 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:6.72, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Esomeprazole Capsule, 40 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:10.88, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Lactulose Liquid 3.1–3.7 g/5 mL (300 mL)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:78.88, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Magnesium Sulphate Salt (1G)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Magnesium Trisilicate + Aluminium Hydroxide Mixture (200 mL)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:13.38, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Magnesium Trisilicate + Aluminium Hydroxide Tablet', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Magnesium Trisilicate Mixture (200 mL)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Magnesium Trisilicate Tablet, 500 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Mebeverine Tablet, 135 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Metoclopramide Injection, 5 mg/mL in 2 mL (Ampoule)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Metoclopramide Syrup, 5 mg/5 mL (200 mL)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:67.68, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Metoclopramide Tablet, 10 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Omeprazole Injection, 40 mg (Vial)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:38.4, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Omeprazole Tablet, 20 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Paraffin Liquid (100 mL)', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:10.75, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ranitidine Tablet, 150 mg', cat:'Gastrointestinal', desc:'Gastrointestinal — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── General Medicine ── */
  { name:'Acetazolamide Injection, 500 mg (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:132.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Acetazolamide Tablet, 250 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Acetylcysteine Injection, 200 mg/mL (1 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:249.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Allopurinol Tablet, 100 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Allopurinol Tablet, 300 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amiodarone Tablet, 200 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Anti RH Immunoglobulin Injection, 1500IU (Vial)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:624.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Betaxolol HCL Eye Drops, 0.5% (5 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:70.72, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Bromocriptine Tablet, 2.5 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:7.14, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Carbocisteine Paediatric Syrup , 125 mg/5 mL (100 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:20.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Carbocisteine Syrup, 250 mg/5 mL (100 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:24.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Chloramphenicol Ear Drops, 5% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Chloramphenicol Eye Drops, 0.5% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Chloramphenicol Eye Ointment, 1% (5G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Chloramphenicol Injection, 1 g (1G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:7.78, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Chloramphenicol Suspension, 125mg/5mL (100 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Cholera Replacement Fluid Injection, (5:4:1) 500 mL', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:15.81, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Cholera Replacement Fluid Injection, (5:4:1) 1 (1000 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:19.68, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Corticosteroid + Antibiotic Eye Drops (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:27.2, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Corticosteroid + Antibiotic Eye Ointment (10 G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:24.64, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Cyclopentolate Eye Drops, 1% (5 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:48.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Disopyramide Capsule, 100 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Disopyramide Phosphate Injection, 10 mg/mL in 5 mL (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:56.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ephedrine HCI Injection, 30 mg/mL (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:19.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ephedrine Nasal Drops, 0.5% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Ephedrine Nasal Drops, 1% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:11.2, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Ergotamine Tablet, 2 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ferric Ammonium Citrate Mixture (FAC) (200 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Finasteride Tablet, 5 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Glucagon Injection, 1 mg (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:251.36, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Human Immune Tetanus Globulins Injection, 250 IU/mL (1 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:85.12, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Human Immune Tetanus Globulins Injection, 500 IU/mL (2 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Hydroxocobalamin Injection, 1 mg/mL (1 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:24.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Intralipid Solution (for TPN) (500 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:164.8, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Iron (III) Polymaltose Complex Capsule', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Iron (III) Polymaltose Complex Suspension (200 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:16.16, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Iron Dextran Injection, 50 mg/mL (2 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.08, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Iron Sucrose Injection, 20 mg/mL (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:55.74, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Lidocaine Cream, 2% (15 G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:28.8, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Lidocaine Gel, 4% (15 G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:36.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Lodoxamide Eye Drops, 0.1% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:102.4, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Magnesium Sulphate Injection, 20% (10 mL) (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:6.56, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Magnesium Sulphate Injection, 50% (10 mL) (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:21.76, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Methyl Cellulose Eye Drops, 0.3% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:44.8, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Oral Rehydration Salts Powder (Sachet)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80' },
  { name:'Phenol 5% in Almond Oil Injection (50 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:23.94, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Pilocarpine Eye Drops, 2% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:40.0, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Pilocarpine Eye Drops, 4% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:44.8, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Potassium Citrate Mixture BP (200 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:9.28, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Prazosin Tablet, 500 microgram', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Silver Sulphadiazine Cream, 1% (50 G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:20.8, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Simple Linctus BPC (Paediatric) (125mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Simple Linctus BPC (200mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:18.88, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Sodium Bicarbonate Injection, 8.4% in 10 mL (Ampoule)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:11.84, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Soothing Agent + Local Anaesthetic + Steroid Ointment (15 G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:48.0, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Soothing Agent + Local Anaesthetic + Steroid Suppository', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Soothing Agent + Local Anaesthetic Ointment (15 G)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:44.8, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Soothing Agent + Local Anaesthetic (Supp)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Sulfasalazine Tablet, 500 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Tamsulosin Capsule, 400 microgram', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Terazosin Tablet, 2 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Terazosin Tablet, 5 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Terbinafine HCl Tablet, 250 mg', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Timolol Maleate Eye Drops, 0.5% (10 mL)', cat:'General Medicine', desc:'General Medicine — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:23.65, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },

  /* ── IV Fluids & Electrolytes ── */
  { name:'Amino Acid Solution Injection, 10% (200 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:79.2, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Amino Acid Solution Injection, 20% (200 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:82.56, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Badoe\'s Solution Injection, 1000 mL', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:26.14, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Darrow\'s Solution Injection, HalfStrength 250 (250 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:10.85, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose in Sodium Chloride Intravenous Infusion, 4.3% in 0.18% (250 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:12.38, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose in Sodium Chloride Intravenous Infusion, 5% in 0.9% (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:15.49, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose Infusion, 5% (250 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:12.38, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose Infusion, 5% (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:15.36, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose Infusion, 10% (250 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:12.64, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose Infusion, 10% (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:15.84, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Dextrose Infusion, 50% (250 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:14.59, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Gelatin Infusion (Succinylated Gelatin) (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:46.4, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Mannitol Injection, 10% (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:25.18, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Mannitol Injection, 20% (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:31.65, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Potassium Chloride Injection, 20 mEq/10 mL (Vial)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:16.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Potassium Chloride Tablet, 600 mg (Enteric Coated)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ringer - Lactate Solution, 500 mL', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:13.44, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Sodium Chloride Infusion, 0.45% (250 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:12.19, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Sodium Chloride Infusion, 0.9% (500 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:15.01, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Sodium Chloride Nasal Drops, 0.9% (10 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80' },
  { name:'Water for Injection (10 mL)', cat:'IV Fluids & Electrolytes', desc:'IV Fluids & Electrolytes — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },

  /* ── Neuro/Psychiatric ── */
  { name:'Amitriptyline Tablet, 10 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amitriptyline Tablet, 25 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Amitriptyline Tablet, 50 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Benzatropine Injection, 1 mg/mL (1 mL)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:27.68, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Benzatropine Tablet, 2 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Carbamazepine Tablet, 100 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Carbamazepine Tablet, 200 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Carbamazepine Sustained-Release Tablet (200 Tablet)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Chlorpromazine Injection, 25 mg/mL in 2 mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:8.48, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Chlorpromazine Tablet, 25 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Chlorpromazine Tablet, 50 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Chlorpromazine Tablet, 100 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Diazepam Injection, 5 mg/mL in 2 mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:8.1, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Diazepam Rectal Tubes, 2 mg/mL in 1.25 mL Rectal', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:14.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Diazepam Tablet, 5 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Diazepam Tablet, 10 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ethosuximide Syrup, 250 mg/5 mL (200 mL)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:103.2, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Ethosuximide Tablet, 250 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:20.8, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Fluoxetine Capsule, 20 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Flupentixol Tablet, 500 microgram', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Flupentixol Tablet, 1mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Fluphenazine Deconoate Injection, 25 mg/mL (1 mL)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:58.4, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Haloperidol Injection, 5 mg/5 mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:12.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Haloperidol Tablet, 0.5 mg (Capsule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Haloperidol Tablet, 5 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Haloperidol Tablet, 10 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Imipramine Tablet, 25 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lorazepam Injection, 4 mg/mL in 1mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:9.92, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Lorazepam Tablet, 1 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lorazepam Tablet, 2 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Lorazepam Tablet, 2.5 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Midazolam Injection, 5 mg/5mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:39.23, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Midazolam Tablet, 15 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:9.6, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Phenobarbital Elixir, 15 mg/5 mL (100 mL)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:18.91, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Phenobarbital Injection, 200 mg/mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:18.24, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Phenobarbital Tablet, 30 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Phenobarbital Tablet, 60 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Phenytoin Injection, 50 mg/mL in 5 mL (Ampoule)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:76.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Phenytoin Sodium Capsule, 50 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Phenytoin Sodium Capsule, 100 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Phenytoin Sodium Tablet, 100 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Piracetam Tablet, 800 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Primidone Tablet, 250 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Risperidone Liquid, 1 mg/mL (10 mL)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:159.04, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Risperidone Tablet, 500 microgram', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Risperidone Tablet, 1 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Risperidone Tablet, 2 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5.12, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Sertraline Tablet, 50 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Sertraline Tablet, 100 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Sodium Valproate Capsule, 200 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Sodium Valproate Capsule (Slow Release)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:9.57, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Sodium Valproate Syrup, 200 mg/5 mL (300 mL)', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:230.08, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Sodium Valproate Tablet, 200 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Trihexyphenidyl Tablet, 2 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Trihexyphenidyl Tablet, 5 mg', cat:'Neuro/Psychiatric', desc:'Neuro/Psychiatric — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Oncology ── */
  { name:'Adriamycin Injection, 50 mg (Vial)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:166.4, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Anastrozole Tablet, 1 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:25.44, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Capecitabine Tablet, 500 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:60.8, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Cyclophosphamide Injection, 500 mg (Vial)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:26.46, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Docetaxel Injection, 20 mg/mL (Ampoule)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:704.96, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Granisetron Injection, 1 mg/1mL (Ampoule)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:94.5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Granisetron Tablet, 1 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:44.9, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Methotrexate Injection, 2.5 mg/ mL (Ampoule)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:17.6, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Methotrexate Injection, 25 mg/ mL in 2mL (Ampoule)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:48.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Methotrexate Tablet, 2.5 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Methotrexate Tablet, 10 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Paclitaxel Injection, 6 mg/mL in 5 mL (Vial)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:640.0, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Tamoxifen Tablet, 10 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Tamoxifen Tablet, 20 mg', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'5-Fluorouracil Injection, 50 mg/mL (10 mL)', cat:'Oncology', desc:'Oncology — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:28.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },

  /* ── Respiratory ── */
  { name:'Aminophylline Injection, 250 mg/10 mL (Ampoule)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Beclometasone Dipropionate Inhaler, 50 microgram/metered dose (200 doses)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:136.0, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Beclometasone Dipropionate Inhaler, 100 microgram/metered dose (200 doses)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:204.8, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Beclometasone Dipropionate Inhaler, 200 microgram/metered dose (200 doses)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:288.0, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Budesonide + Formoterol Inhaler 160 microgram/4.5 microgram (60 Doses)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:357.18, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Budesonide + Formoterol Inhaler 80 microgram/4.5 microgram (60 Doses)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:219.94, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Budesonide DPI, 100 microgram (100 Doses) (Inhaler)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:153.6, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Budesonide DPI, 200 microgram (100 Doses) (Inhaler)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:236.29, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Fluticasone + Salmeterol Inhaler, 250 microgram/50 microgram (60 doses)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:308.99, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Fluticasone MDI, 50 microgram (120 Dose) (Inhaler)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:97.66, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Fluticasone MDI, 125 microgram (120 Dose) (Inhaler)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:175.81, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Fluticasone MDI, 250 microgram (120 Dose) (Inhaler)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:294.4, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Salbutamol Inhaler, 100 microgram/metered dose, 200 doses', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:57.6, img:'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80' },
  { name:'Salbutamol Nebules, 2.5 mg (Dose)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Salbutamol Nebules, 5 mg (Dose)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:8.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Salbutamol Sulphate Injection, 500 microgram/mL in 1mL (Ampoule)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B2 (District Hospital). Ask our pharmacist for dosing and suitability.', price:20.8, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Salbutamol Syrup, 2 mg/5 mL (200 mL)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:13.6, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Salbutamol Tablet, 2 mg', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Salbutamol Tablet, 4 mg', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Theophylline Tablet, 200 mg (slow release)', cat:'Respiratory', desc:'Respiratory — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Thyroid ── */
  { name:'Carbimazole Tablet, 5 mg', cat:'Thyroid', desc:'Thyroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Carbimazole Tablet, 20 mg', cat:'Thyroid', desc:'Thyroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Levothyroxine Sodium Tablet, 25 microgram', cat:'Thyroid', desc:'Thyroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Levothyroxine Sodium Tablet, 50 microgram', cat:'Thyroid', desc:'Thyroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Levothyroxine Sodium Tablet, 100 microgram', cat:'Thyroid', desc:'Thyroid — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Propylthiouracil Tablet, 50 mg', cat:'Thyroid', desc:'Thyroid — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:21.6, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Vitamins & Supplements ── */
  { name:'Calciferol Tablet, 10,000 units', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:9.28, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Calcium Carbonate Tablet, 500 mg', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: B1 (Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Calcium Gluconate Injection, 100 mg/mL in (Ampoule)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:16.93, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Calcium with Vitamin D Tablet, (97 mg + 10 microgram)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ferrous Fumarate Tablet, 100 mg (Elemental Iron)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ferrous Sulphate (BPC) Syrup, 60 mg/5 mL (200 mL)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:12.64, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Ferrous Sulphate + Folic Acid Tablet, 50 mg (Elemental Iron) + 400 mic', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ferrous Sulphate Tablet, 60 mg (Elemental Iron)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Folic Acid Tablet, 5 mg (Blister Pack) (10 Tablets)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Multivitamin Drops (20 mL)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:14.66, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Multivitamin Syrup (125 mL)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:8.32, img:'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80' },
  { name:'Multivitamin Tablet (Blister Pack) (10 Tablets)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Retinol Soft Capsule, 200,000 IU', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80' },
  { name:'Thiamine Injection, 100 mg (Vial)', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Thiamine Tablet, 50 mg', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Thiamine Tablet, 100 mg', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Zinc Tablet, 10 mg', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Zinc Tablet, 20 mg', cat:'Vitamins & Supplements', desc:'Vitamins & Supplements — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },

  /* ── Women's Health ── */
  { name:'Conjugated Oestrogen + Norgesterol Tablet, 625 microgram + 150 microgr', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:6.4, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Conjugated Oestrogen Tablet, 625 microgram', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Conjugated Oestrogen Vaginal cream, 625 microgram/g (1G)', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80' },
  { name:'Diethylstilboestrol Tablet, 1 mg', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:80.0, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Diethylstilboestrol Tablet, 5 mg', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: SD (Specialist/Teaching Hospital). Ask our pharmacist for dosing and suitability.', price:131.2, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Ergometrine Injection, 0.2 mg/mL (1 mL)', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ergometrine Injection, 0.5 mg/ml (1 mL)', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: M (Over-the-counter). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Ergometrine Tablet, 0.5 mg', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Medroxyprogesterone Acetate Tablet, 5 mg', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: C (District Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Norethisterone Tablet, 5 mg', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: D (Regional Hospital). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80' },
  { name:'Oxytocin Injection, 5 units/mL (Ampoule)', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },
  { name:'Oxytocin Injection, 10 units/mL (Ampoule)', cat:'Women\'s Health', desc:'Women\'s Health — NHIS-listed medicine. Prescribing level: A (Community/Health Centre). Ask our pharmacist for dosing and suitability.', price:5, img:'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80' },

];


/* ============================================================
   UNIQUE ICON GENERATION
   Every product on the page needs its own distinct visual — no
   two different drugs should ever show the same picture. Rather
   than juggle hundreds of hand-picked stock photos (how the old
   catalogue ended up with repeats), we generate a deterministic
   little "pill" icon per drug from its name. Same drug name always
   renders the same icon; different names always land on different
   colours/initials, so nothing is duplicated.
   ============================================================ */

/* Simple string hash to a positive integer, used to seed colour */
function _hashStr(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/* Builds a unique inline SVG "pill" icon for a given product name.
   Returns a data: URI usable directly as an <img src>. */
function pillIcon(name) {
  var h1 = _hashStr(name);
  var h2 = _hashStr(name.split('').reverse().join('') + '#2');
  var hueA = h1 % 360;
  var hueB = h2 % 360;
  var words = name.replace(/[^A-Za-z\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  var initials = ((words[0] || 'R')[0] + (words[1] ? words[1][0] : ((words[0] || 'rx')[1] || 'x'))).toUpperCase();

  var bg   = 'hsl(' + hueA + ',38%,93%)';
  var capA = 'hsl(' + hueA + ',62%,55%)';
  var capB = 'hsl(' + hueB + ',68%,46%)';
  var txt  = 'hsl(' + hueA + ',45%,26%)';

  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" rx="20" fill="' + bg + '"/>' +
      '<g transform="translate(100,88) rotate(-38)">' +
        '<rect x="-64" y="-22" width="64" height="44" rx="22" fill="' + capA + '"/>' +
        '<rect x="0" y="-22" width="64" height="44" rx="22" fill="' + capB + '"/>' +
        '<rect x="-64" y="-22" width="128" height="44" rx="22" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="2"/>' +
      '</g>' +
      '<text x="100" y="168" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="' + txt + '">' + initials + '</text>' +
    '</svg>';

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}


/* ============================================================
   REAL PRODUCT PHOTOGRAPHY (by dosage form)
   Real medicine photos, grouped by dosage form so a tablet shows
   real tablets, a syrup shows a real syrup bottle, a cream shows
   a real cream tube, and so on. Within a large catalogue like
   ours, a handful of drugs sharing the *same* dosage form will
   reasonably share a photo (there just aren't hundreds of
   distinct rights-cleared pharmacy photos to draw from) — but no
   drug is ever shown a picture from the wrong category, and the
   generated pillIcon() above is kept as a guaranteed-unique
   fallback badge, layered on as a small corner tag so every card
   still reads as visually distinct at a glance.
   ============================================================ */
var IMAGE_BANK = {
  tablet: [
    'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=500&q=80',
    'https://images.unsplash.com/photo-1549477752-31cd7327aed0?w=500&q=80',
    'https://images.unsplash.com/photo-1625144094117-6612bbbe0a33?w=500&q=80',
    'https://images.unsplash.com/photo-1742181207763-9150475d7219?w=500&q=80'
  ],
  capsule: [
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    'https://images.unsplash.com/photo-1574157668644-cce54591add8?w=500&q=80'
  ],
  topical: [
    'https://images.unsplash.com/photo-1703153859507-1504dfbe494e?w=500&q=80'
  ],
  injection: [
    'https://images.unsplash.com/photo-1578308175085-444a1fbea0fe?w=500&q=80'
  ],
  inhaler: [
    'https://images.unsplash.com/photo-1695820632971-28cd17651b41?w=500&q=80'
  ],
  sachet: [
    'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=500&q=80'
  ],
  liquid: [
    'https://images.unsplash.com/photo-1647572485946-fae868d8b587?w=500&q=80'
  ],
  drops: [
    'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=500&q=80'
  ],
  contraceptive: [
    'https://images.unsplash.com/photo-1575879711582-0024b37f2bfa?w=500&q=80',
    'https://images.unsplash.com/photo-1573209946145-848669b5ef39?w=500&q=80'
  ]
};

/* Sniffs a drug's name/form for keywords and returns the matching
   IMAGE_BANK bucket key. Falls back to 'tablet', the most common form. */
function _detectForm(text) {
  var t = text.toLowerCase();
  if (/(cream|ointment|gel|lotion|suppository|vaginal|shampoo)/.test(t)) return 'topical';
  if (/(injection|ampoule|vial|infusion)/.test(t)) return 'injection';
  if (/(inhaler|puffer|metered dose)/.test(t)) return 'inhaler';
  if (/(sachet|powder|ors\b)/.test(t)) return 'sachet';
  if (/(syrup|elixir|suspension|solution|mixture|linctus)/.test(t)) return 'liquid';
  if (/(eye drop|ear drop|nasal|drops|spray)/.test(t)) return 'drops';
  if (/(condom|contracepti|pill \(ocp\)|implant|iud)/.test(t)) return 'contraceptive';
  if (/(capsule)/.test(t)) return 'capsule';
  return 'tablet';
}

/* Picks a real photo for a grouped product — matched to its
   dosage form, and always the same photo for the same product. */
function realImage(baseName, variants) {
  var sniffText = baseName + ' ' + (variants && variants[0] ? variants[0].name : '');
  var bucketKey = _detectForm(sniffText);
  var bucket = IMAGE_BANK[bucketKey] || IMAGE_BANK.tablet;
  var idx = _hashStr(baseName) % bucket.length;
  return bucket[idx];
}
/* ============================================================
   PRODUCT GROUPING
   Many catalogue rows are really just different strengths of the
   SAME drug (e.g. "Paracetamol 500mg" / "Paracetamol 1000mg", or
   the NHIS-style "Atenolol Tablet, 25 mg" / "..., 50 mg"). We
   collapse those into a single product card with a milligram
   dropdown, instead of showing the same drug over and over.
   ============================================================ */

/* Splits a raw medicine name into { base, variantLabel }.
   base = the drug's shared product name (used for grouping + icon)
   variantLabel = the strength/dose text shown in the dropdown (or null) */
function _splitVariant(name) {
  var comma = name.indexOf(',');
  if (comma !== -1) {
    return { base: name.slice(0, comma).trim(), variantLabel: name.slice(comma + 1).trim() };
  }
  var m = name.match(/^(.*?)\s+([\d.]+\s*(?:mg|mcg|microgram|micrograms|g|IU|iu|%)\b.*)$/i);
  if (m) {
    return { base: m[1].trim(), variantLabel: m[2].trim() };
  }
  return { base: name.trim(), variantLabel: null };
}

/* Builds the grouped PRODUCTS array + a lookup map by id.
   Runs once immediately, so search and the frequently ordered
   widget can both use the same product data. */
var PRODUCTS = [];
var PRODUCTS_BY_ID = {};

(function buildProducts() {
  var groups = {};
  var order = [];

  MEDICINES.forEach(function (m) {
    var split = _splitVariant(m.name);
    var key = split.base.toLowerCase();
    if (!groups[key]) {
      groups[key] = { base: split.base, cat: m.cat, variants: [] };
      order.push(key);
    }
    groups[key].variants.push({
      label: split.variantLabel || 'Standard',
      name: m.name,
      price: m.price,
      desc: m.desc,
      cat: m.cat
    });
  });

  order.forEach(function (key, idx) {
    var g = groups[key];
    var id = 'p' + idx;
    var product = {
      id: id,
      base: g.base,
      cat: g.cat,
      photo: realImage(g.base, g.variants),
      icon: pillIcon(g.base),
      variants: g.variants
    };
    PRODUCTS.push(product);
    PRODUCTS_BY_ID[id] = product;
  });
})();


/* ============================================================
   CART MANAGEMENT
   The cart is a plain object: { itemName: { price, qty }, ... }
   ============================================================ */

/* The cart object — keyed by medicine name */
var _cart = {};


/* ── ADD TO CART ─────────────────────────────────────────────
   Adds one unit of a medicine. If already in cart, increments.
   Parameters: name, price (GHS), img (optional), meta (optional subtitle)
   ──────────────────────────────────────────────────────────── */
function addToCart(name, price, img, meta) {
  if (!_cart[name]) {
    _cart[name] = { price: price, qty: 1, img: img || pillIcon(name), meta: meta || '' };
  } else {
    _cart[name].qty += 1;
  }
  saveCart(_cart);
  renderCart();
  showToast(name + ' added to cart ✓');
  flashCartIcon();
}


/* ── ADD FREQUENT ITEM TO CART ───────────────────────────────
   Reads the qty stepper value from a freq-card and adds that
   many units to the cart.
   Parameters: name (string), price (number), btn (element)
   ──────────────────────────────────────────────────────────── */
function addFreqToCart(name, price, btn) {
  /* Walk up from the clicked button to find the qty display */
  var card   = btn.closest('.freq-card');
  var fcBody = btn.closest('.fc-body');
  var qtyEl  = fcBody ? fcBody.querySelector('.qty-val') : null;
  var qty    = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
  var cardImg = card ? card.querySelector('img') : null;
  var subEl   = card ? card.querySelector('.fc-sub') : null;
  var img  = cardImg ? cardImg.src : pillIcon(name);
  var meta = subEl ? subEl.textContent.trim() : '';

  if (!_cart[name]) {
    _cart[name] = { price: price, qty: 0, img: img, meta: meta };
  }
  _cart[name].qty += qty;

  saveCart(_cart);
  renderCart();
  showToast(name + ' ×' + qty + ' added to cart ✓');
  flashCartIcon();
}


/* ── ADD A GROUPED PRODUCT (with milligram dropdown) TO CART ──
   Called from a product card's "+ Add" button. Reads whichever
   variant/strength is currently selected in that card's dropdown
   (or the only variant, if there's no dropdown) and adds it.
   ──────────────────────────────────────────────────────────── */
function addProductToCart(btn) {
  var card = btn.closest('.med-card-v2');
  if (!card) return;
  var pid = card.getAttribute('data-pid');
  var product = PRODUCTS_BY_ID[pid];
  if (!product) return;

  var select = card.querySelector('.variant-select');
  var idx = select ? parseInt(select.value, 10) : 0;
  var variant = product.variants[idx] || product.variants[0];
  var meta = product.cat + (variant.label !== 'Standard' ? ' · ' + variant.label : '');

  if (!_cart[variant.name]) {
    _cart[variant.name] = { price: variant.price, qty: 1, img: product.photo, meta: meta };
  } else {
    _cart[variant.name].qty += 1;
  }
  saveCart(_cart);
  renderCart();
  showToast(variant.name + ' added to cart ✓');
  flashCartIcon();
}


/* ── VARIANT DROPDOWN CHANGE ──────────────────────────────────
   When the person picks a different strength from a product
   card's dropdown, update the price + description shown on
   that same card to match the newly selected strength.
   ──────────────────────────────────────────────────────────── */
function onVariantChange(select) {
  var card = select.closest('.med-card-v2');
  if (!card) return;
  var pid = card.getAttribute('data-pid');
  var product = PRODUCTS_BY_ID[pid];
  if (!product) return;

  var idx = parseInt(select.value, 10);
  var variant = product.variants[idx];
  if (!variant) return;

  var priceEl = card.querySelector('.med-price');
  var descEl  = card.querySelector('.med-desc');
  if (priceEl) priceEl.textContent = 'GHS ' + variant.price;
  if (descEl)  descEl.textContent  = variant.desc;
}


/* ── REMOVE FROM CART ────────────────────────────────────────
   Removes an item entirely from the cart by name.
   ──────────────────────────────────────────────────────────── */
function removeFromCart(name) {
  delete _cart[name];
  saveCart(_cart);
  renderCart();
}


/* ── RENDER CART ─────────────────────────────────────────────
   Rebuilds the "Your Cart" panel: item list (adidas-bag style —
   thumbnail, name, meta line, quantity dropdown, trash icon) plus
   the order summary card. Called after every cart modification.
   ──────────────────────────────────────────────────────────── */
function renderCart() {
  var container   = document.getElementById('cart-items');
  var summaryCard = document.getElementById('cart-summary-card');
  var payBtn      = document.getElementById('pay-order-btn');
  var totalVal    = document.getElementById('cart-total-val');
  var subtotalVal = document.getElementById('summary-subtotal');
  var itemCountEl = document.getElementById('summary-item-count');
  var pageCountEl = document.getElementById('cart-page-count');
  if (!container) return;

  var keys = Object.keys(_cart);
  var totalQty = keys.reduce(function (sum, k) { return sum + _cart[k].qty; }, 0);
  animateCartBadge(totalQty);

  if (pageCountEl) pageCountEl.textContent = '(' + totalQty + ' item' + (totalQty !== 1 ? 's' : '') + ')';

  /* Empty cart state */
  if (keys.length === 0) {
    container.innerHTML = '<div class="empty-cart">No items yet — search or pick from the popular list above.</div>';
    if (summaryCard) summaryCard.style.display = 'none';
    if (payBtn)      payBtn.style.display      = 'none';
    return;
  }
  if (summaryCard) summaryCard.style.display = 'block';
  if (payBtn)       payBtn.style.display      = 'flex';

  /* Build a quantity dropdown 1–10, pre-selected to the current qty */
  function qtyOptions(current) {
    var opts = '';
    for (var i = 1; i <= 10; i++) {
      opts += '<option value="' + i + '"' + (i === current ? ' selected' : '') + '>' + i + '</option>';
    }
    return opts;
  }

  /* Build line items */
  var subtotal = 0;
  var html = keys.map(function (name) {
    var item = _cart[name];
    var lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    var safeName = name.replace(/'/g, "\\'");
    var icon = item.img || pillIcon(name);
    return '<div class="cart-item">' +
      '<img class="ci-thumb" src="' + icon + '" alt="">' +
      '<div class="ci-info">' +
        '<div class="ci-top-row">' +
          '<span class="ci-name">' + name + '</span>' +
          '<button class="ci-remove" onclick="removeFromCart(\'' + safeName + '\')" aria-label="Remove ' + name + ' from cart">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>' +
          '</button>' +
        '</div>' +
        (item.meta ? '<div class="ci-meta">' + item.meta + '</div>' : '') +
        '<div class="ci-bottom-row">' +
          '<div class="select-wrap ci-qty-wrap">' +
            '<select class="qty-select" onchange="setCartQty(\'' + safeName + '\', this.value)" aria-label="Quantity">' + qtyOptions(item.qty) + '</select>' +
            '<svg class="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          '</div>' +
          '<span class="ci-price">GHS ' + lineTotal.toFixed(0) + '</span>' +
        '</div>' +
      '</div>' +
      '</div>';
  }).join('');

  container.innerHTML = html;

  /* Update order summary card */
  var delivery = 10;
  var total = subtotal + delivery;
  if (itemCountEl) itemCountEl.textContent = totalQty + ' item' + (totalQty !== 1 ? 's' : '');
  if (subtotalVal) subtotalVal.textContent = 'GHS ' + subtotal.toFixed(0);
  if (totalVal)    totalVal.textContent    = 'GHS ' + total.toFixed(0);
}


/* ── CHANGE / SET CART QUANTITY ───────────────────────────────
   setCartQty is used by the quantity dropdown in the cart panel
   (adidas-style); changeCartQty is kept for any +/- steppers
   elsewhere (e.g. the Frequently Ordered cards).
   ──────────────────────────────────────────────────────────── */
function setCartQty(name, valueStr) {
  if (!_cart[name]) return;
  var qty = parseInt(valueStr, 10) || 1;
  _cart[name].qty = qty;
  saveCart(_cart);
  renderCart();
}

function changeCartQty(name, delta) {
  if (!_cart[name]) return;
  _cart[name].qty += delta;
  if (_cart[name].qty <= 0) delete _cart[name];
  saveCart(_cart);
  renderCart();
}


/* ============================================================
   NAV CART DROPDOWN (Amazon/Adidas-style mini cart)
   Sits as its own button beside the Sign In / Register controls
   in the top nav. Clicking it pops open a small panel with the
   cart contents instead of navigating away from the page.
   ============================================================ */

/* Animates the little badge count on the cart icon so it visibly
   counts up/down to the new total instead of jumping straight there. */
var _badgeAnimTimer = null;
function animateCartBadge(newTotal) {
  var badge = document.getElementById('cart-badge');
  if (!badge) return;

  var current = parseInt(badge.textContent, 10) || 0;
  clearInterval(_badgeAnimTimer);

  if (newTotal === 0) {
    badge.style.display = 'none';
    badge.textContent = '0';
    return;
  }
  badge.style.display = 'flex';

  if (current === newTotal) {
    badge.textContent = newTotal;
    return;
  }

  var step = newTotal > current ? 1 : -1;
  _badgeAnimTimer = setInterval(function () {
    current += step;
    badge.textContent = current;
    if (current === newTotal) clearInterval(_badgeAnimTimer);
  }, 45);
}

/* Little pulse/pop on the cart icon whenever something is added */
function flashCartIcon() {
  var btn = document.getElementById('nav-cart-toggle');
  if (!btn) return;
  btn.classList.remove('cart-pop');
  /* Restart animation even if it's already mid-flight */
  void btn.offsetWidth;
  btn.classList.add('cart-pop');
}

/* Opens/closes the cart dropdown. Pass forceOpen=true/false to set
   an explicit state, or call with no second argument to toggle. */
function toggleCartDropdown(e, forceOpen) {
  if (e) e.stopPropagation();
  var dropdown = document.getElementById('cart-dropdown');
  if (!dropdown) return;
  var shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : !dropdown.classList.contains('open');
  dropdown.classList.toggle('open', shouldOpen);
  syncModalScrollLock();
}

/* Close the dropdown when clicking anywhere outside it, OR when
   clicking the dim backdrop itself (outside the white panel) */
document.addEventListener('click', function (e) {
  var dropdown = document.getElementById('cart-dropdown');
  var toggleBtn = document.getElementById('nav-cart-toggle');
  if (!dropdown || !dropdown.classList.contains('open')) return;
  if (e.target === dropdown) { dropdown.classList.remove('open'); syncModalScrollLock(); return; }
  if (dropdown.contains(e.target) || (toggleBtn && toggleBtn.contains(e.target))) return;
  dropdown.classList.remove('open');
  syncModalScrollLock();
});


/* ── PROCEED TO CHECKOUT ─────────────────────────────────────
   Called from the "Checkout" button inside the cart dropdown.
   The delivery-details form only appears once the person has
   reviewed and confirmed their cart — so this simply reveals
   that section and scrolls to it instead of jumping straight
   to payment.
   ──────────────────────────────────────────────────────────── */
function proceedToCheckout() {
  if (Object.keys(_cart).length === 0) {
    showToast('Your cart is empty — add items before checking out.');
    return;
  }
  toggleCartDropdown(null, false);

  var section = document.getElementById('delivery-section');
  if (section) {
    section.classList.add('open');
    syncModalScrollLock();
    setTimeout(function () {
      var nameEl = document.getElementById('del-name');
      if (nameEl) nameEl.focus();
    }, 50);
  }
}

/* Close the delivery-details modal without submitting. */
function closeDeliveryModal() {
  var section = document.getElementById('delivery-section');
  if (section) section.classList.remove('open');
  syncModalScrollLock();
}


/* ── GET CART TOTAL ──────────────────────────────────────────
   Returns total amount including GHS 10 delivery fee.
   Used by payment modal to display correct amount.
   ──────────────────────────────────────────────────────────── */
function getCartTotal() {
  var subtotal = Object.values(_cart).reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);
  return subtotal + 10;
}


/* ── QUANTITY STEPPER (Frequent Items) ───────────────────────
   Called by the +/- buttons on freq-cards.
   Parameters: btn (element), delta (+1 or -1)
   ──────────────────────────────────────────────────────────── */
function changeFreqQty(btn, delta) {
  var qtyEl = btn.closest('.qty-row').querySelector('.qty-val');
  if (!qtyEl) return;
  var current = parseInt(qtyEl.textContent) || 1;
  var next    = Math.max(1, current + delta);  /* Minimum qty is 1 */
  qtyEl.textContent = next;
}


/* ============================================================
   MEDICINE SEARCH
   Searches MEDICINES array against name, category and description.
   Debounced to avoid running on every keystroke.
   ============================================================ */

/* Timer reference for debounce */
var _searchTimer = null;


/* ── INIT SEARCH ─────────────────────────────────────────────
   Attaches input event listener to the search box.
   Called on DOMContentLoaded.
   ──────────────────────────────────────────────────────────── */
function initSearch() {
  var input = document.getElementById('med-search-input');
  if (!input) return;

  input.addEventListener('input', function () {
    clearTimeout(_searchTimer);
    var q = input.value.trim().toLowerCase();

    if (q.length < 2) {
      /* Hide results, show frequently ordered */
      document.getElementById('search-results-section').style.display = 'none';
      document.getElementById('freq-section').style.display = 'block';
      document.getElementById('search-hint').textContent =
        'Type at least 2 characters to search our full catalogue.';
      return;
    }

    /* Debounce: wait 200ms after user stops typing */
    _searchTimer = setTimeout(function () { runSearch(q); }, 200);
  });
}


/* ── QUICK CATEGORY SEARCH ───────────────────────────────────
   Called by the category chip row above the search box.
   Fills the search input and runs a search for that category. */
function quickCategorySearch(catTerm) {
  var input = document.getElementById('med-search-input');
  var q = catTerm.toLowerCase();
  if (input) input.value = catTerm;
  document.getElementById('search-hint').textContent = '';
  runSearch(q);
}


/* ── RUN SEARCH ──────────────────────────────────────────────
   Filters the grouped PRODUCTS list and renders results.
   ──────────────────────────────────────────────────────────── */
function runSearch(q) {
  /* Filter by base name, category, or any variant's name/description */
  var results = PRODUCTS.filter(function (p) {
    if (p.base.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)) return true;
    return p.variants.some(function (v) {
      return v.name.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q);
    });
  });

  /* Switch from freq-section to results section */
  document.getElementById('freq-section').style.display = 'none';
  var rs = document.getElementById('search-results-section');
  var rg = document.getElementById('search-results-grid');
  rs.style.display = 'block';

  /* Update results count heading */
  document.getElementById('search-results-title').textContent =
    results.length + ' result' + (results.length !== 1 ? 's' : '') +
    ' for "' + q + '"';

  document.getElementById('search-hint').textContent = '';

  /* No results state */
  if (results.length === 0) {
    rg.innerHTML = '<p style="color:var(--sage);font-size:14px;grid-column:1/-1;">' +
      'No medicines found matching "' + q + '". Try a different search term or browse categories below.</p>';
    return;
  }

  /* Render one card per product — each drug gets its own unique
     icon, and drugs with several strengths get a dropdown to pick
     from instead of showing as separate duplicate-looking cards. */
  rg.innerHTML = results.map(renderProductCard).join('');
}


/* ── RENDER A PRODUCT CARD ───────────────────────────────────
   Builds the HTML for one grouped product. If it has more than
   one strength/variant, a dropdown is shown; picking a strength
   updates the price + description shown on the card.
   ──────────────────────────────────────────────────────────── */
function renderProductCard(p) {
  var first = p.variants[0];
  var variantMarkup = '';

  if (p.variants.length > 1) {
    var options = p.variants.map(function (v, i) {
      return '<option value="' + i + '">' + v.label + '</option>';
    }).join('');
    variantMarkup =
      '<div class="variant-row">' +
        '<label>Strength</label>' +
        '<div class="select-wrap">' +
          '<select class="variant-select" onchange="onVariantChange(this)">' + options + '</select>' +
          '<svg class="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</div>' +
      '</div>';
  }

  return '<div class="med-card-v2" data-pid="' + p.id + '">' +
    '<div class="med-img-wrap">' +
      '<img class="med-img" src="' + p.photo + '" alt="' + p.base + '">' +
      '<img class="med-badge" src="' + p.icon + '" alt="">' +
    '</div>' +
    '<div class="med-body">' +
      '<span class="med-tag">' + p.cat + '</span>' +
      '<h4>' + p.base + '</h4>' +
      '<p class="med-desc">' + first.desc + '</p>' +
      variantMarkup +
      '<div class="med-foot">' +
        '<span class="med-price">GHS ' + first.price + '</span>' +
        '<button class="add-btn" onclick="addProductToCart(this)">+ Add</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}


/* ============================================================
   ORDER FORM
   ============================================================ */

/* ── HANDLE ORDER SUBMIT ─────────────────────────────────────
   Validates cart and delivery fields, then opens payment modal.
   ──────────────────────────────────────────────────────────── */
function handleOrderSubmit(e) {
  e.preventDefault();

  /* Must have at least one item */
  if (Object.keys(_cart).length === 0) {
    showToast('Add at least one item to your cart first.');
    return false;
  }

  /* Validate name */
  var nameEl = document.getElementById('del-name');
  if (!nameEl || !nameEl.value.trim()) {
    showToast('Please enter your full name.');
    return false;
  }

  /* Validate phone */
  var phoneEl = document.getElementById('del-phone');
  if (!phoneEl || phoneEl.value.replace(/\D/g, '').length < 9) {
    showToast('Please enter a valid phone number.');
    return false;
  }

  /* Validate address */
  var locEl = document.getElementById('delivery-location');
  if (!locEl || !locEl.value.trim()) {
    showToast('Please enter your delivery address or use live location.');
    return false;
  }

  /* Close delivery modal, then open payment modal with cart total */
  closeDeliveryModal();
  var total = getCartTotal();
  openPayModal('order', total, function () {
    /* After payment confirmed — reveal tracking */
    showToast('Order placed! Tracking your delivery now 🛵');
    revealTracking();
    /* Clear cart and reset the delivery section for next time */
    _cart = {};
    saveCart(_cart);
    renderCart();
    var section = document.getElementById('delivery-section');
    if (section) section.classList.remove('open');
  });

  return false;
}


/* ============================================================
   LIVE TRACKING (Leaflet / OpenStreetMap)
   Simulates a rider moving from pharmacy to destination
   along a real route through Accra.
   ============================================================ */

/* Leaflet map instance — kept in module scope so we can remove it */
var _trackingMap    = null;
/* Leaflet marker for the moving rider */
var _riderMarker    = null;
/* Current step index along RIDER_PATH */
var _trackStep      = 0;
/* setInterval handle so we can clear it */
var _trackInterval  = null;

/* Centre of map — roughly East Legon / Airport Hills area */
var ACCRA_CENTER = [5.636, -0.174];

/* Waypoints the rider moves through (real Accra coordinates) */
var RIDER_PATH = [
  [5.621, -0.195],
  [5.626, -0.190],
  [5.630, -0.185],
  [5.634, -0.180],
  [5.636, -0.178],
  [5.638, -0.175],
  [5.639, -0.172],
  [5.640, -0.170]
];

/* Status text shown at each waypoint */
var TRACK_STAGES = [
  'Pharmacist preparing your order',
  'Rider has picked up your order',
  'On the way to your location',
  'On the way — 10 min away',
  'Almost there — nearby now',
  'Arriving soon!',
  'Almost at your doorstep',
  'Arrived ✓'
];

/* ETA minutes at each waypoint */
var TRACK_ETAS = [22, 18, 14, 10, 7, 4, 2, 0];


/* ── REVEAL TRACKING SECTION ─────────────────────────────────
   Shows the tracking card and initialises the Leaflet map.
   ──────────────────────────────────────────────────────────── */
function revealTracking() {
  var section = document.getElementById('order-tracking-result');
  if (!section) return;
  section.style.display = 'block';
  /* Give browser a frame to paint the section before scrolling */
  setTimeout(function () {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  initLeafletTracking();
}


/* ── INIT LEAFLET TRACKING ───────────────────────────────────
   Creates the map, adds markers, draws the route, starts
   the rider animation interval.
   ──────────────────────────────────────────────────────────── */
function initLeafletTracking() {
  /* Remove old map if re-initialising */
  if (_trackingMap) {
    _trackingMap.remove();
    _trackingMap = null;
  }
  /* Reset state */
  _trackStep = 0;
  if (_trackInterval) clearInterval(_trackInterval);

  var mapEl = document.getElementById('tracking-map-leaflet');
  if (!mapEl || typeof L === 'undefined') return;

  /* Create Leaflet map */
  _trackingMap = L.map(mapEl, {
    zoomControl:       false,
    attributionControl: false
  }).setView(ACCRA_CENTER, 14);

  /* OpenStreetMap tile layer */
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:     19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(_trackingMap);

  /* Attribution in a corner */
  L.control.attribution({ prefix: false }).addTo(_trackingMap);

  /* Pharmacy origin pin */
  L.marker(RIDER_PATH[0], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:#0B3D3A;color:#fff;border-radius:50%;' +
            'width:32px;height:32px;display:flex;align-items:center;' +
            'justify-content:center;font-size:15px;border:3px solid #fff;' +
            'box-shadow:0 2px 8px rgba(0,0,0,.3);">💊</div>',
      iconAnchor: [16, 16]
    })
  }).addTo(_trackingMap).bindPopup('HealthPlus Pharmacy');

  /* Destination (home) pin */
  L.marker(RIDER_PATH[RIDER_PATH.length - 1], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:#E85C4A;color:#fff;border-radius:50%;' +
            'width:32px;height:32px;display:flex;align-items:center;' +
            'justify-content:center;font-size:15px;border:3px solid #fff;' +
            'box-shadow:0 2px 8px rgba(0,0,0,.3);">🏠</div>',
      iconAnchor: [16, 16]
    })
  }).addTo(_trackingMap).bindPopup('Your Location');

  /* Dashed route polyline */
  L.polyline(RIDER_PATH, {
    color:     '#0B3D3A',
    weight:    3,
    dashArray: '6 8'
  }).addTo(_trackingMap);

  /* Moving rider marker */
  _riderMarker = L.marker(RIDER_PATH[0], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:#E85C4A;color:#fff;border-radius:50%;' +
            'width:36px;height:36px;display:flex;align-items:center;' +
            'justify-content:center;font-size:18px;border:3px solid #fff;' +
            'box-shadow:0 2px 12px rgba(232,92,74,.6);">🛵</div>',
      iconAnchor: [18, 18]
    })
  }).addTo(_trackingMap);

  /* Render first frame */
  updateTrackingUI();

  /* Move rider every 3 seconds */
  _trackInterval = setInterval(function () {
    if (_trackStep >= RIDER_PATH.length - 1) {
      clearInterval(_trackInterval);
      return;
    }
    _trackStep++;
    _riderMarker.setLatLng(RIDER_PATH[_trackStep]);
    _trackingMap.panTo(RIDER_PATH[_trackStep]);
    updateTrackingUI();
  }, 3000);
}


/* ── UPDATE TRACKING UI ──────────────────────────────────────
   Updates ETA, stage text and progress bar for current step.
   ──────────────────────────────────────────────────────────── */
function updateTrackingUI() {
  var idx = Math.min(_trackStep, TRACK_STAGES.length - 1);

  var eta      = document.getElementById('tracking-eta-text');
  var stage    = document.getElementById('tracking-stage-text');
  var progress = document.getElementById('tracking-progress-fill');

  if (eta)   eta.textContent   = TRACK_ETAS[idx] === 0 ? 'Arrived!' : TRACK_ETAS[idx] + ' min';
  if (stage) stage.textContent = TRACK_STAGES[idx];
  if (progress) {
    var pct = ((_trackStep / (RIDER_PATH.length - 1)) * 100).toFixed(0);
    progress.style.width = pct + '%';
  }
}


/* ============================================================
   RIDER CHAT
   Simulates a real-time text chat with the delivery rider.
   Rider replies from a scripted sequence of responses.
   ============================================================ */

/* Scripted rider responses in order */
var RIDER_REPLIES = [
  "I'm on my way, should be with you soon! 🛵",
  "Traffic is a bit slow on the main road but I'll be there shortly.",
  "About 10 minutes away now.",
  "I'm turning into your street now.",
  "I'm right outside — please come to the door.",
  "Package delivered! Have a great day 😊",
  "Let me know if you need anything else!"
];

/* Index of next reply to use */
var _riderReplyIdx = 0;


/* ── OPEN RIDER CHAT ─────────────────────────────────────────
   Shows the chat overlay window.
   ──────────────────────────────────────────────────────────── */
function openRiderChat() {
  var overlay = document.getElementById('rider-chat-overlay');
  if (overlay) overlay.classList.add('open');
}


/* ── CLOSE RIDER CHAT ────────────────────────────────────────
   Hides the chat overlay window.
   ──────────────────────────────────────────────────────────── */
function closeRiderChat() {
  var overlay = document.getElementById('rider-chat-overlay');
  if (overlay) overlay.classList.remove('open');
}


/* ── SEND CHAT MESSAGE ───────────────────────────────────────
   Adds the user's message bubble, then after 1.2s adds
   a rider reply from the scripted sequence.
   ──────────────────────────────────────────────────────────── */
function sendChatMsg() {
  var input = document.getElementById('chat-input');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;

  var messages = document.getElementById('chat-messages');
  if (!messages) return;

  /* Get current time for timestamp */
  var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* Append user bubble */
  messages.innerHTML +=
    '<div class="chat-msg user">' + _escapeHtml(msg) +
    '<div class="msg-time">' + time + '</div></div>';

  /* Clear input and scroll to bottom */
  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  /* Simulate rider typing delay then reply */
  setTimeout(function () {
    var reply = RIDER_REPLIES[_riderReplyIdx % RIDER_REPLIES.length];
    _riderReplyIdx++;
    var t2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.innerHTML +=
      '<div class="chat-msg rider">' + reply +
      '<div class="msg-time">' + t2 + '</div></div>';
    messages.scrollTop = messages.scrollHeight;
  }, 1200);
}


/* ── ESCAPE HTML ─────────────────────────────────────────────
   SECURITY: Sanitises user-typed chat message text before
   inserting it into the DOM. Prevents XSS attacks where a
   user types <script> tags into the chat input.
   ──────────────────────────────────────────────────────────── */
function _escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


/* ── CLOSE CHAT ON OVERLAY CLICK ─────────────────────────────
   Clicking the dark backdrop area closes the chat window.
   ──────────────────────────────────────────────────────────── */

/* NOTE: Direct "pay now" from the cart dropdown was replaced by
   proceedToCheckout() above — the delivery form now only appears
   after the person reviews their cart, and its own onsubmit
   handler (handleOrderSubmit, below) validates + opens payment. */

document.addEventListener('DOMContentLoaded', function () {
  /* Hydrate the in-page cart from the shared (persisted) store */
  _cart = loadCart();
  renderCart();

  /* Initialise search listener */
  initSearch();

  /* Give every "Frequently Ordered" card its own unique icon —
     generated from its own name, so no two cards ever match. */
  document.querySelectorAll('.freq-card').forEach(function (card) {
    var h4 = card.querySelector('h4');
    var img = card.querySelector('img');
    if (h4 && img) {
      img.src = realImage(h4.textContent.trim(), null);
      img.removeAttribute('onerror');
    }
  });

  /* If arriving from a category link (e.g. services.html?cat=Analgesic),
     pre-fill the search box and run that category's search. */
  var params = new URLSearchParams(window.location.search);
  var catParam = params.get('cat');
  if (catParam) {
    quickCategorySearch(catParam);
  }

  /* Attach order form submit */
  var orderForm = document.getElementById('delivery-form');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }

  /* Chat overlay backdrop click */
  var chatOverlay = document.getElementById('rider-chat-overlay');
  if (chatOverlay) {
    chatOverlay.addEventListener('click', function (e) {
      if (e.target === chatOverlay) closeRiderChat();
    });
  }

  /* Chat input Enter key */
  var chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendChatMsg();
    });
  }

  /* Delivery-details modal backdrop click + ESC to close */
  var deliveryOverlay = document.getElementById('delivery-section');
  if (deliveryOverlay) {
    deliveryOverlay.addEventListener('click', function (e) {
      if (e.target === deliveryOverlay) closeDeliveryModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDeliveryModal();
  });

  /* Checkout button in the cart dropdown — reveals the delivery
     details form (which stays hidden until the cart is confirmed)
     rather than jumping straight to payment. */
  var payBtn = document.getElementById('pay-order-btn');
  if (payBtn) {
    payBtn.addEventListener('click', proceedToCheckout);
  }
});
