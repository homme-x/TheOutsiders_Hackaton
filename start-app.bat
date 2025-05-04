@echo off
echo Démarrage de l'application e-commerce ENSPY...
echo.

echo Démarrage du backend NestJS...
start cmd /k "cd e-commerce-backend && npm run start:dev"

echo Démarrage du frontend React...
start cmd /k "cd e-commerce && npm run dev"

echo.
echo L'application est en cours de démarrage...
echo - Backend: http://localhost:3001/api
echo - Frontend: http://localhost:3000
echo.
echo Utilisateurs de test:
echo - Admin: admin@enspy.com / password123
echo - Vendeur: vendeur@enspy.com / password123
echo - Client: client@enspy.com / password123
echo.
echo Pour initialiser la base de données avec des données de test, exécutez:
echo cd e-commerce-backend && npm run seed
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul
