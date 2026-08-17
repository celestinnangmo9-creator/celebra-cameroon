import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Mettre à jour l'état pour que le prochain rendu affiche l'UI de remplacement.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Vous pouvez aussi enregistrer l'erreur dans un service de rapport d'erreurs
        console.error("Uncaught error in React component:", error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Vous pouvez afficher n'importe quelle UI de remplacement.
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg overflow-hidden border border-red-200">
                        <div className="bg-red-50 p-6 border-b border-red-100 flex items-center">
                            <svg className="w-8 h-8 text-red-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <h1 className="text-2xl font-bold text-red-700 font-serif">Oups ! Une erreur d'affichage est survenue.</h1>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-700 mb-6">
                                Désolé, le composant de cette page a rencontré une erreur inattendue. L'équipe technique (ou l'agent QA) a été avertie via la console.
                            </p>
                            
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-[#0B3D2E] text-white px-6 py-2 rounded-md hover:bg-[#082a20] transition-colors"
                            >
                                Recharger la page
                            </button>

                            {/* En environnement local, on affiche les détails techniques pour le débuggage */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="mt-8">
                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Détails techniques (Visible uniquement en mode dev)</h2>
                                    <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                                        <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                                            {this.state.error.toString()}
                                        </pre>
                                        <pre className="text-gray-400 text-xs font-mono mt-4 whitespace-pre-wrap">
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
