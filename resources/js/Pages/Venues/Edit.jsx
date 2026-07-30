import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function EditVenue({ auth, venue, regionsAndCities, categories, availableAmenities }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: venue.title || '',
        category: venue.category || categories[0] || '',
        region: venue.region || Object.keys(regionsAndCities)[0],
        city: venue.city || regionsAndCities[venue.region || Object.keys(regionsAndCities)[0]][0],
        district: venue.district || '',
        address: venue.address || '',
        capacity: venue.capacity || '',
        price_per_day: venue.price_per_day || '',
        price_per_hour: venue.price_per_hour || '',
        description: venue.description || '',
        status: venue.status || 'active',
        main_image: null,
        gallery: [],
        amenities: venue.amenities || [],
    });

    const submit = (e) => {
        e.preventDefault();
        // Nous utilisons un POST avec _method='PUT' pour que Laravel gère l'upload de fichiers
        post(route('venues.update', venue.id));
    };

    const handleRegionChange = (e) => {
        const newRegion = e.target.value;
        setData({
            ...data,
            region: newRegion,
            city: regionsAndCities[newRegion][0] || ''
        });
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setData('amenities', [...data.amenities, value]);
        } else {
            setData('amenities', data.amenities.filter((item) => item !== value));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Modifier l'espace : {venue.title}</h2>}
        >
            <Head title={`Modifier ${venue.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50">
                        <div className="p-8 text-gray-900 dark:text-gray-100">
                            
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    Édition de l'espace
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Mettez à jour les informations, tarifs ou ajoutez de nouvelles photos.</p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Titre de l'espace *" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoComplete="title"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category */}
                                    <div>
                                        <InputLabel htmlFor="category" value="Catégorie *" />
                                        <select
                                            id="category"
                                            name="category"
                                            value={data.category}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-600 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-md shadow-sm"
                                            onChange={(e) => setData('category', e.target.value)}
                                            required
                                        >
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>

                                    {/* Region */}
                                    <div>
                                        <InputLabel htmlFor="region" value="Région *" />
                                        <select
                                            id="region"
                                            name="region"
                                            value={data.region}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-600 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-md shadow-sm"
                                            onChange={handleRegionChange}
                                            required
                                        >
                                            {Object.keys(regionsAndCities).map((region, index) => (
                                                <option key={index} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.region} className="mt-2" />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <InputLabel htmlFor="city" value="Ville *" />
                                        <select
                                            id="city"
                                            name="city"
                                            value={data.city}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-600 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-md shadow-sm"
                                            onChange={(e) => setData('city', e.target.value)}
                                            required
                                        >
                                            {regionsAndCities[data.region]?.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* District */}
                                    <div>
                                        <InputLabel htmlFor="district" value="Quartier *" />
                                        <TextInput
                                            id="district"
                                            type="text"
                                            name="district"
                                            value={data.district}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('district', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.district} className="mt-2" />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <InputLabel htmlFor="address" value="Adresse précise *" />
                                        <TextInput
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={data.address}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('address', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Statut de la salle *" />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-600 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-md shadow-sm"
                                            onChange={(e) => setData('status', e.target.value)}
                                            required
                                        >
                                            <option value="active">Actif (En location)</option>
                                            <option value="maintenance">En maintenance</option>
                                            <option value="booked">Réservé</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Capacity */}
                                    <div>
                                        <InputLabel htmlFor="capacity" value="Capacité max. *" />
                                        <TextInput
                                            id="capacity"
                                            type="number"
                                            name="capacity"
                                            value={data.capacity}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.capacity} className="mt-2" />
                                    </div>

                                    {/* Price / Day */}
                                    <div>
                                        <InputLabel htmlFor="price_per_day" value="Tarif / jour (FCFA) *" />
                                        <TextInput
                                            id="price_per_day"
                                            type="number"
                                            name="price_per_day"
                                            value={data.price_per_day}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price_per_day', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.price_per_day} className="mt-2" />
                                    </div>

                                    {/* Price / Hour */}
                                    <div>
                                        <InputLabel htmlFor="price_per_hour" value="Tarif / heure (Facultatif)" />
                                        <TextInput
                                            id="price_per_hour"
                                            type="number"
                                            name="price_per_hour"
                                            value={data.price_per_hour}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price_per_hour', e.target.value)}
                                        />
                                        <InputError message={errors.price_per_hour} className="mt-2" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description détaillée *" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-600 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-md shadow-sm"
                                        rows="4"
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-800/50">
                                    <h4 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Gestion des Médias</h4>
                                    
                                    {/* Main Image */}
                                    <div className="mb-6 flex flex-col md:flex-row gap-6 items-start">
                                        <div className="w-full md:w-1/3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Image principale actuelle :</p>
                                            {venue.main_image ? (
                                                <img src={venue.main_image} alt="Main" className="w-full h-32 object-cover rounded-lg shadow-sm" />
                                            ) : (
                                                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-500">Aucune</div>
                                            )}
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <InputLabel htmlFor="main_image" value="Remplacer l'image principale (Optionnel)" />
                                            <input
                                                id="main_image"
                                                type="file"
                                                accept="image/*"
                                                name="main_image"
                                                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-gray-700 dark:file:text-amber-400"
                                                onChange={(e) => setData('main_image', e.target.files[0])}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Laissez vide pour conserver l'image actuelle.</p>
                                            <InputError message={errors.main_image} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Gallery */}
                                    <div className="flex flex-col md:flex-row gap-6 items-start border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <div className="w-full md:w-1/3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Galerie actuelle :</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {venue.gallery_images && venue.gallery_images.length > 0 ? (
                                                    venue.gallery_images.map((img, idx) => (
                                                        <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-16 object-cover rounded shadow-sm" />
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500 col-span-2">Aucune image supplémentaire</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <InputLabel htmlFor="gallery" value="Ajouter de nouvelles photos/vidéos à la galerie (Optionnel)" />
                                            <input
                                                id="gallery"
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                name="gallery"
                                                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-gray-700 dark:file:text-amber-400"
                                                onChange={(e) => setData('gallery', Array.from(e.target.files))}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Ces nouvelles images s'ajouteront à la galerie existante.</p>
                                            <InputError message={errors.gallery} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <InputLabel value="Équipements inclus" className="mb-3" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        {availableAmenities.map((amenity, index) => (
                                            <label key={index} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={amenity}
                                                    checked={data.amenities.includes(amenity)}
                                                    onChange={handleCheckboxChange}
                                                    className="w-4 h-4 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Actions */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <PrimaryButton disabled={processing} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 focus:bg-amber-700 active:bg-amber-800">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                                        Enregistrer les modifications
                                    </PrimaryButton>
                                    
                                    <a
                                        href={`/venues/${venue.id}`}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        Annuler
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
