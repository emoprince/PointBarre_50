import React, { useState, useMemo, ChangeEvent } from 'react';
import { EventQuoteDetails } from './types';
import { BASE_PRICE, MAX_PEOPLE_FOR_BASE_PRICE, CROISSANT_PRICE, BISCUIT_PACK_PRICE, OWNER_EMAIL, CUSTOM_CUPS_PRICE, CUSTOM_DRINK_PRICE, MUSIC_AMBIANCE_PRICE } from './constants';
import QuantitySelector from './components/QuantitySelector';
import { UploadIcon, TrashIcon } from './components/icons/Icons';

// Initial state for the form
const initialState: EventQuoteDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  personCount: '',
  croissantCount: '0',
  biscuitPacks: '0',
  wantsCustomCups: false,
  customCupsNotes: '',
  wantsCustomDrink: false,
  customDrinkNotes: '',
  wantsMusicAmbiance: false,
  musicAmbianceNotes: '',
};

// BEST PRACTICE: Define stateless components outside the main component
// to prevent them from being recreated on every render. This improves stability.
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-[#FFFEE7]/30">
        <h3 className="text-xl font-semibold text-[#FFFEE7] mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);


const App: React.FC = () => {
  const [details, setDetails] = useState<EventQuoteDetails>(initialState);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);

  const personCountParsed = Number(details.personCount) || 0;
  const isPersonCountInvalid = personCountParsed > MAX_PEOPLE_FOR_BASE_PRICE;

  const totalPrice = useMemo(() => {
    const croissantCount = Number(details.croissantCount) || 0;
    const biscuitPacks = Number(details.biscuitPacks) || 0;

    let total = BASE_PRICE;
    total += croissantCount * CROISSANT_PRICE;
    total += biscuitPacks * BISCUIT_PACK_PRICE;
    if (details.wantsCustomCups) total += CUSTOM_CUPS_PRICE;
    if (details.wantsCustomDrink) total += CUSTOM_DRINK_PRICE;
    if (details.wantsMusicAmbiance) total += MUSIC_AMBIANCE_PRICE;
    return total;
  }, [
    details.croissantCount,
    details.biscuitPacks,
    details.wantsCustomCups,
    details.wantsCustomDrink,
    details.wantsMusicAmbiance
  ]);

  // A single, simple handler for all text and checkbox inputs.
  // It directly sets the state without complex logic, fixing the input bug.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setDetails(prevDetails => ({
        ...prevDetails,
        [name]: inputValue,
    }));
  };
  
  // A dedicated handler for the quantity selectors.
  const handleQuantityChange = (field: 'croissantCount' | 'biscuitPacks', value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setLogoFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  
  const removeFile = (fileName: string) => {
    setLogoFiles(prev => prev.filter(file => file.name !== fileName));
  };
  
  const createMailtoLink = () => {
    const subject = encodeURIComponent(`Demande de devis de ${details.firstName} ${details.lastName}`);
    let body = `Bonjour,\n\nVoici les détails pour une demande de devis :\n\n`;
    body += `COORDONNÉES :\n`;
    body += `- Prénom : ${details.firstName}\n`;
    body += `- Nom : ${details.lastName}\n`;
    body += `- Email : ${details.email}\n`;
    body += `- Téléphone : ${details.phone || 'Non fourni'}\n`;
    body += `- Nombre de personnes : ${details.personCount || 'Non spécifié'}\n\n`;
    body += `OPTIONS & SUPPLÉMENTS :\n`;
    body += `- Croissants Acarré : ${Number(details.croissantCount) > 0 ? `${details.croissantCount} pièce(s)` : 'Non'}\n`;
    body += `- Biscuits personnalisés : ${Number(details.biscuitPacks) > 0 ? `${details.biscuitPacks} paquet(s)` : 'Non'}\n`;
    body += `- Gobelets personnalisés : ${details.wantsCustomCups ? `Oui (coût estimé ajouté)\n  Notes: ${details.customCupsNotes || 'Aucune'}` : 'Non'}\n`;
    body += `- Boisson personnalisée : ${details.wantsCustomDrink ? `Oui (coût estimé ajouté)\n  Notes: ${details.customDrinkNotes || 'Aucune'}` : 'Non'}\n`;
    body += `- Ambiance musicale : ${details.wantsMusicAmbiance ? `Oui (coût estimé ajouté)\n  Notes: ${details.musicAmbianceNotes || 'Aucune'}` : 'Non'}\n\n`;

    if (logoFiles.length > 0) {
        body += `LOGOS :\n`;
        body += `- ${logoFiles.length} logo(s) seront joints manuellement par le client.\n\n`;
    }
    body += `----------------------------------\n`;
    body += `PRIX ESTIMÉ : ${totalPrice.toFixed(2)} CHF\n`;
    body += `----------------------------------\n\n`;
    body += `Cordialement,\n${details.firstName}`;

    return `mailto:${OWNER_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-[#006C60] text-[#FFFEE7] overflow-hidden border border-[#FFFEE7] my-4 sm:my-6 md:my-8">
        <header className="p-8 text-center">
          <p className="text-xl text-[#FFFEE7]/90">Configurez votre pack et obtenez une estimation instantanée.</p>
        </header>
        
        <main className="grid md:grid-cols-3">
          <div className="md:col-span-2 p-6 md:p-8">
            <FormSection title="1. Vos coordonnées">
                <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="Prénom" value={details.firstName} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70" required />
                    <input type="text" name="lastName" placeholder="Nom" value={details.lastName} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70" required />
                    <input type="email" name="email" placeholder="Adresse email" value={details.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70" required />
                    <input type="tel" name="phone" placeholder="Numéro (optionnel)" value={details.phone} onChange={handleInputChange} className="w-full px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Nombre de personnes (max {MAX_PEOPLE_FOR_BASE_PRICE} pour le pack de base)</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="personCount" value={details.personCount} onChange={handleInputChange} placeholder="Ex: 25" className={`w-full px-3 py-2 bg-transparent border ${isPersonCountInvalid ? 'border-red-400' : 'border-[#FFFEE7]'} focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70`} />
                    {isPersonCountInvalid && <p className="text-red-400 text-xs mt-1">Le pack de base est limité à {MAX_PEOPLE_FOR_BASE_PRICE} personnes. Pour plus, veuillez nous contacter.</p>}
                </div>
            </FormSection>
            
            <FormSection title="2. Options & Suppléments">
                <div className="p-3 bg-[#FFFEE7]/10">
                    <QuantitySelector title={`Croissants Acarré (${CROISSANT_PRICE.toFixed(2)} CHF / pièce)`} value={details.croissantCount} onChange={(val) => handleQuantityChange('croissantCount', val)} max={100}/>
                </div>
                <div className="p-3 bg-[#FFFEE7]/10">
                    <QuantitySelector title={`Paquets de biscuits personnalisés (${BISCUIT_PACK_PRICE.toFixed(2)} CHF / paquet)`} value={details.biscuitPacks} onChange={(val) => handleQuantityChange('biscuitPacks', val)} max={20}/>
                </div>
                <label className="flex items-center space-x-3 p-3 bg-[#FFFEE7]/10 cursor-pointer hover:bg-[#FFFEE7]/20">
                    <input type="checkbox" name="wantsCustomCups" checked={details.wantsCustomCups} onChange={handleInputChange} className="h-5 w-5 border-gray-300 text-[#FFFEE7] focus:ring-[#FFFEE7]"/>
                    <span>Gobelets personnalisés (estimé: {CUSTOM_CUPS_PRICE.toFixed(2)} CHF)</span>
                </label>
                {details.wantsCustomCups && <textarea name="customCupsNotes" placeholder="Décrivez vos besoins pour les gobelets..." value={details.customCupsNotes} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70"/>}
                <label className="flex items-center space-x-3 p-3 bg-[#FFFEE7]/10 cursor-pointer hover:bg-[#FFFEE7]/20">
                    <input type="checkbox" name="wantsCustomDrink" checked={details.wantsCustomDrink} onChange={handleInputChange} className="h-5 w-5 border-gray-300 text-[#FFFEE7] focus:ring-[#FFFEE7]"/>
                    <span>Boisson personnalisée (estimé: {CUSTOM_DRINK_PRICE.toFixed(2)} CHF)</span>
                </label>
                {details.wantsCustomDrink && <textarea name="customDrinkNotes" placeholder="Décrivez vos besoins pour la boisson..." value={details.customDrinkNotes} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70"/>}
                <label className="flex items-center space-x-3 p-3 bg-[#FFFEE7]/10 cursor-pointer hover:bg-[#FFFEE7]/20">
                    <input type="checkbox" name="wantsMusicAmbiance" checked={details.wantsMusicAmbiance} onChange={handleInputChange} className="h-5 w-5 border-gray-300 text-[#FFFEE7] focus:ring-[#FFFEE7]"/>
                    <span>Ambiance musicale (estimé: {MUSIC_AMBIANCE_PRICE.toFixed(2)} CHF)</span>
                </label>
                {details.wantsMusicAmbiance && <textarea name="musicAmbianceNotes" placeholder="Décrivez vos envies musicales (style, playlist...)" value={details.musicAmbianceNotes} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 bg-transparent border border-[#FFFEE7] focus:ring-2 focus:ring-[#FFFEE7] placeholder:text-[#FFFEE7]/70"/>}
            </FormSection>
            
            <FormSection title="3. Vos Logos (.png, .jpg)">
                <label htmlFor="logo-upload" className="w-full text-center cursor-pointer flex items-center justify-center gap-2 bg-[#FFFEE7] text-[#006C60] font-bold py-3 px-4 hover:bg-[#FFFEE7]/90 transition-colors duration-300">
                    <UploadIcon />
                    Ajouter des fichiers
                </label>
                <input id="logo-upload" type="file" multiple accept=".png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
                {logoFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {logoFiles.map(file => (
                            <div key={file.name} className="flex justify-between items-center bg-[#FFFEE7]/10 p-2 text-sm">
                                <span>{file.name}</span>
                                <button onClick={() => removeFile(file.name)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                            </div>
                        ))}
                    </div>
                )}
                <p className="text-xs text-center text-[#FFFEE7]/70 mt-2">Note: Vous devrez attacher manuellement les fichiers à l'email.</p>
            </FormSection>
          </div>
          
          <div className="md:col-span-1 bg-[#005a50] p-6 md:p-8 md:sticky top-8 self-start md:mt-[6.25rem]">
            <h2 className="text-2xl font-bold text-[#FFFEE7] mb-4 border-b-2 border-[#FFFEE7]/30 pb-3">Résumé du devis</h2>
            <div className="text-sm text-[#FFFEE7]/90 space-y-2 my-4 p-4 bg-[#006C60] border border-[#FFFEE7]/30">
                <p><strong>Pour événements jusqu’à 50 personnes</strong></p>
                <p>Service barista complet de 3h avec café, lait sans lactose ou avoine, logo sur mousse et matériel inclus.</p>
                <p>Le tarif couvre l’ensemble des frais — installation, service, nettoyage et transport dans Lausanne (10 km). Au-delà, un supplément est appliqué : 0.75 CHF/km aller-retour.</p>
                <p>💡 Environ 15 CHF/personne – idéal pour petits événements ou réunions d’entreprise.</p>
            </div>
            <div className="space-y-3 text-[#FFFEE7] mb-6">
                <div className="flex justify-between"><span>Pack Base (jusqu'à {MAX_PEOPLE_FOR_BASE_PRICE} pers.)</span> <strong>{BASE_PRICE.toFixed(2)} CHF</strong></div>
                {Number(details.croissantCount) > 0 && <div className="flex justify-between"><span>Suppl. Croissants</span> <strong>+{(Number(details.croissantCount) * CROISSANT_PRICE).toFixed(2)} CHF</strong></div>}
                {Number(details.biscuitPacks) > 0 && <div className="flex justify-between"><span>Suppl. Biscuits</span> <strong>+{(Number(details.biscuitPacks) * BISCUIT_PACK_PRICE).toFixed(2)} CHF</strong></div>}
                {details.wantsCustomCups && <div className="flex justify-between"><span>Suppl. Gobelets Perso.</span> <strong>+{CUSTOM_CUPS_PRICE.toFixed(2)} CHF</strong></div>}
                {details.wantsCustomDrink && <div className="flex justify-between"><span>Suppl. Boisson Perso.</span> <strong>+{CUSTOM_DRINK_PRICE.toFixed(2)} CHF</strong></div>}
                {details.wantsMusicAmbiance && <div className="flex justify-between"><span>Suppl. Ambiance Musique</span> <strong>+{MUSIC_AMBIANCE_PRICE.toFixed(2)} CHF</strong></div>}
            </div>
            <div className="text-center bg-[#FFFEE7] text-[#006C60] p-4">
              <p className="text-lg">Total estimé</p>
              <p className="text-5xl font-extrabold tracking-tight">{totalPrice.toFixed(2)} CHF</p>
            </div>
            <a href={createMailtoLink()} className="mt-6 w-full text-center block bg-[#FFFEE7] text-[#006C60] font-bold py-3 px-4 hover:bg-[#FFFEE7]/90 transition-colors duration-300">
                Envoyer la demande par Email
            </a>
            <p className="text-xs text-center text-[#FFFEE7]/70 mt-2">
              Cela ouvrira votre client de messagerie par défaut.
            </p>
          </div>
        </main>
    </div>
  );
};

export default App;