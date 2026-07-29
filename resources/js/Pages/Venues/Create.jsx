import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateVenue({ auth, cities, categories, availableAmenities }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: categories[0] || '',
        city: cities[0] || '',
        district: '',
        address: '',
        capacity: '',
        price_per_day: '',
        price_per_hour: '',
        description: '',
        main_image: null,
        gallery: [],
        amenities: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('venues.store'));
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Publier un nouvel espace</h2>}
        >
            <Head title="Ajouter une salle" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50">
                        <div className="p-8 text-gray-900 dark:text-gray-100">
                            
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Détails de l'espace
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Remplissez ce formulaire pour ajouter votre salle, jardin ou terrasse au catalogue Celebra Cameroon.</p>
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
                                        isFocused={true}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Ex: Palais des Lumières & Espace Banquet"
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
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500 dark:focus:ring-emerald-600 rounded-md shadow-sm"
                                            onChange={(e) => setData('category', e.target.value)}
                                            required
                                        >
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <InputLabel htmlFor="city" value="Ville *" />
                                        <select
                                            id="city"
                                            name="city"
                                            value={data.city}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500 dark:focus:ring-emerald-600 rounded-md shadow-sm"
                                            onChange={(e) => setData('city', e.target.value)}
                                            required
                                        >
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            placeholder="Ex: Bonapriso, Bastos..."
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
                                            placeholder="Ex: Avenue des Palmiers"
                                            required
                                        />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Capacity */}
                                    <div>
                                        <InputLabel htmlFor="capacity" value="Capacité max. (Invités) *" />
                                        <TextInput
                                            id="capacity"
                                            type="number"
                                            name="capacity"
                                            value={data.capacity}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            placeholder="Ex: 300"
                                            required
                                        />
                                        <InputError message={errors.capacity} className="mt-2" />
                                    </div>

                                    {/* Price / Day */}
                                    <div>
                                        <InputLabel htmlFor="price_per_day" value="Tarif par jour (FCFA) *" />
                                        <TextInput
                                            id="price_per_day"
                                            type="number"
                                            name="price_per_day"
                                            value={data.price_per_day}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price_per_day', e.target.value)}
                                            placeholder="Ex: 250000"
                                            required
                                        />
                                        <InputError message={errors.price_per_day} className="mt-2" />
                                    </div>

                                    {/* Price / Hour */}
                                    <div>
                                        <InputLabel htmlFor="price_per_hour" value="Tarif par heure (Facultatif)" />
                                        <TextInput
                                            id="price_per_hour"
                                            type="number"
                                            name="price_per_hour"
                                            value={data.price_per_hour}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price_per_hour', e.target.value)}
                                            placeholder="Ex: 35000"
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
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500 dark:focus:ring-emerald-600 rounded-md shadow-sm"
                                        rows="4"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Décrivez l'ambiance, l'insonorisation, les conditions d'accès, etc."
                                        required
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="main_image" value="Image principale (Photo depuis la galerie ou caméra) *" />
                                    <input
                                        id="main_image"
                                        type="file"
                                        accept="image/*"
                                        name="main_image"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-gray-700 dark:file:text-emerald-400"
                                        onChange={(e) => setData('main_image', e.target.files[0])}
                                        required
                                    />
                                    <InputError message={errors.main_image} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="gallery" value="Autres Photos & Vidéos (Sélectionnez plusieurs fichiers)" />
                                    <input
                                        id="gallery"
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        name="gallery"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-gray-700 dark:file:text-emerald-400"
                                        onChange={(e) => setData('gallery', Array.from(e.target.files))}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Images max 10Mo, Vidéos max 50Mo</p>
                                    <InputError message={errors.gallery} className="mt-2" />
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
                                                    onChange={handleCheckboxChange}
                                                    className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Actions */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <PrimaryButton disabled={processing} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        Publier l'annonce
                                    </PrimaryButton>
                                    
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
