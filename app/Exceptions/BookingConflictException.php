<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Throwable;

/**
 * Exception levée lorsqu'une tentative de réservation entre en conflit
 * avec des dates déjà bloquées ou réservées.
 */
class BookingConflictException extends Exception
{
    /**
     * @param string $message Le message d'erreur à afficher à l'utilisateur.
     * @param int $code Code HTTP (409 Conflict par défaut).
     * @param Throwable|null $previous Exception précédente si applicable.
     */
    public function __construct(
        string $message = "La salle n'est pas disponible pour les dates sélectionnées.",
        int $code = 409,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
