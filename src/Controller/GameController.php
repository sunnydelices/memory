<?php

namespace App\Controller;

use App\Entity\Game;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    /**
     * @Route("/")
     * @param EntityManagerInterface $entityManager
     * @return Response
     */
    public function start(EntityManagerInterface $entityManager) {

        // on demande à Doctrine de nous donner le repository de notre class Game
        $repository = $entityManager->getRepository(Game::class);

        // on demande au repository de requetter tous les jeux qu'il a en base
        $games = $repository->findBy(array(),array('duration' => 'ASC'),10);

        foreach ($games as $game) {
            $seconds = intval( ($game->getDuration() / 1000) % 60);
            $minutes = intval( ($game->getDuration() / (1000*60)) % 60);
            $minutes = ($minutes < 10) ? "0" . $minutes : $minutes;
            $seconds = ($seconds < 10) ? "0" . $seconds : $seconds;
            $game->setDuration("00:$minutes:$seconds");
        }

        // on passe les jeux à la vue
        return $this->render('game/index.html.twig', array(
            'games' => $games
        ));
    }

    /**
     * @Route("/newgame/{score}")
     * @param int $score
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     */
    public function new(int $score, EntityManagerInterface $entityManager) {
        // On créé une instance de notre class Game : le nouveau jeu avec le score récupéré en parametre
        $game = new Game();
        $game->setDuration($score);

        // On passe notre objet Game à Doctrine
        $entityManager->persist($game);

        // On demande à Doctrine de sauvegarder notre Game en base
        $entityManager->flush();

        // on demande à Doctrine de nous donner le repository de notre class Game
        $repository = $entityManager->getRepository(Game::class);

        // on demande au repository de requetter tous les jeux qu'il a en base
        $games = $repository->findBy(array(),array('duration' => 'ASC'),10);

        $data = [];
        foreach($games as $game) {
            $seconds = intval( ($game->getDuration() / 1000) % 60);
            $minutes = intval( ($game->getDuration() / (1000*60)) % 60);
            $minutes = ($minutes < 10) ? "0" . $minutes : $minutes;
            $seconds = ($seconds < 10) ? "0" . $seconds : $seconds;
            array_push($data, "00:$minutes:$seconds");
        }

        // on renvoie la liste des scores
        return new JsonResponse(['games' => $data]);
    }

}