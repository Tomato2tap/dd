# Résultat de l'analyse

## Contexte et méthode
J'ai analysé les fichiers textes présents dans `qlik table` et tenté d'extraire le contenu des anciens boards PDF.
- Les fichiers PDF sont en image seule : il n'y a pas de texte intégré exploitable automatiquement.
- L'analyse s'appuie donc principalement sur les dictionnaires de données et sur le besoin métier exprimé dans `constat.md`.

## Observations principales
Les données sont structurées autour de plusieurs domaines :
- `table client.txt` : profil client, type et statut commercial, groupe risque, activité, situation juridique
- `table transaction.txt` : événements transactionnels, montants, canaux, contreparties, pays et risques pays
- `tableepargne.txt` : encours épargne, collecte/décollecte, risque ISIN, provisions IFRS9, variation d'encours
- `table gsm.txt` : positions par ISIN, gestionnaires, taxonomie SFDR et financial disclosure
- `tablecredit.txt` : crédits, montants débloqués, status contrat, type de prêt, risques et provisions
- `tableservice.txt` : services produits, montants tarifés, statut, provisions IFRS9
- `tble garantie.txt` : garanties, montants, revalorisation, couverture, assurance, RWA
- `table evenement.txt` : présent mais vide, à compléter pour les cas d’événements spécifiques

## Limites détectées
- Les anciens boards sont fournis en PDF image-only, donc je ne peux pas récupérer leurs textes ni les reproduire fidèlement.
- En revanche, la structure des données permet de proposer une solution BI plus robuste et adaptée.

## Proposition améliorée
### Objectif
Construire plusieurs versions de tableau de bord adaptées aux usages métiers, avec un même modèle de données sous-jacent.

### Modèle de données central
1. `Client`
   - Identifiant client
   - Type client, statut commercial, groupe risque
   - Données civiles, profession, activité, état du compte
2. `Transaction`
   - Type d'événement, sens, montant, devise
   - Pays client, pays contrepartie, niveau de risque pays
   - Canal, mode paiement, indicateurs de conformité
3. `Épargne` / `Contrat`
   - Encours, volatilité, collecte/décollecte
   - Risque ISIN, provision IFRS9, performance
4. `Crédit`
   - Projet, contrat, montant nominal, montant débloqué
   - Statut prêt, type remboursement, état du prêt
   - Risques, provisions, bucket IFRS9
5. `Service`
   - Contrats de service, montants tarifés, statut, dates
6. `Garantie`
   - Montants garantis, estimation, date de revalorisation
   - Type de garantie, assurance, rang, RWA

## Versions de dashboard proposées
### Version 1 : Board Risque & Conformité
- KPI : volume transactions à risque, nombre de clients sensibles, montants vers pays à restrictions
- Cartes : comptes bloqués, pays embargo, sanctions, AML
- Graphiques : répartition par niveau de risque pays, top 10 contreparties à surveiller
- Table détaillée : événements sensibles par client / contrat
- Filtres : période, type client, statut, pays, type de transaction, canal

### Version 2 : Board Commercial / Relation Client
- KPI : nombre de clients actifs, nouveaux clients, encours moyen par client
- Cartes : segmentation client par type (P, E, S, I), groupe risque, statut relation commerciale
- Graphiques : évolution des encours clients, top 10 produits utilisés, taux de pénétration des services
- Table : clients à fort potentiel / clients inactifs / prospects techniques
- Filtres : segment, agence, produit, état contrat, situation familiale

### Version 3 : Board Crédit & Garanties
- KPI : encours de crédit, montant débloqué, nombre de contrats douteux
- Cartes : crédit sain vs impayé, ratio couverture garanties, montant RWA
- Graphiques : distribution par type de prêt, état du prêt, bucket IFRS9
- Table : garanties par prêt, montants garantis, réévaluations, statut assurance
- Filtres : projet, type prêt, agence, statut contrat, type garantie

### Version 4 : Board Pilotage Épargne & Performance
- KPI : encours total épargne, collecte nette, variation annuelle
- Cartes : volatilité ISIN, provisions IFRS9, poids des fonds par profil
- Graphiques : évolution collecte vs décollète, part de l’épargne durable (SFDR)
- Table : top ISIN, produits à plus fort encours, performances par gestionnaire
- Filtres : type de contrat, risque ISIN, gestionnaire, taxonomie SFDR

## Recommandations pour la meilleure solution
1. Choisir un outil BI flexible : Power BI, Qlik Sense ou Tableau.
2. Créer un modèle de données relationnel simple : Clients ↔ Transactions ↔ Produits (Épargne / Crédit / Services / Garanties).
3. Construire des vues métiers distinctes mais réutilisant les mêmes mesures.
4. Fournir des filtres globaux pour naviguer intuitivement entre les boards.
5. Prioriser d’abord les indicateurs de risque, puis les vues commerciales et crédits.

## Priorités d’implémentation
1. Structurer les sources : importer les fichiers texte et vérifier les clés communes.
2. Compléter la table `table evenement.txt` si nécessaire.
3. Valider les dimensions critiques : type client, groupe risque, pays, produit, statut contrat.
4. Déployer deux premiers boards : `Risque & Conformité` et `Commercial`.
5. Ajouter ensuite les boards `Crédit / Garantie` et `Épargne / Pilotage`.

## Synthèse
Je propose une architecture BI multi-board où chaque version répond à un usage métier précis :
- gouvernance du risque
- suivi commercial
- management du crédit
- pilotage de l’épargne

Ce choix est plus robuste que de reproduire des anciens boards image-only, car il s’appuie sur des données structurées et sur une organisation logique des besoins.

> Voir aussi `WIP/board_propositions.md` pour des propositions détaillées de boards, des KPI précis et un plan de tests basés sur les données disponibles.
