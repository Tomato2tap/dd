# Analyse des Anciens Boards - Thèmes Identifiés

## Contexte
Trois fichiers PDF contenant des anciens dashboards d'une banque (Banque à distance) ont été extraits et analysés.

---

## Thème 1 : Suivi Digital - Banque à Distance

### Objectif
Monitorer l'adoption digitale et l'engagement des clients sur les canaux numériques.

### KPI principaux
- **Clients totaux** : 77 991
- **Clients enrôlés** : 20 893
- **Smartphones enrôlés** : 21 187

### Connexions par canal
- **Web** : ~447 879 connexions
- **Mobile** : ~577 570 connexions
- **iOS** : ~376 886 connexions
- **Android** : variable
- **SVI** : variable

### Visualisations utilisées
- KPI cards en haut de page (synthèse)
- Barres de couleur sombre pour section de résumé
- Graphiques temporels (ligne) pour évolution quotidienne
- Pie charts pour répartition par canal

### Points clés
- Orientation **adoption digitale**
- Focus sur les **canaux de connexion**
- Données **temps réel** ou jour de mise à jour
- Structure simple et lisible

---

## Thème 2 : Portefeuille Produits Bancaires

### Objectif
Vue consolidée des produits bancaires proposés par la banque et leurs statistiques clés.

### Produits couverts

| Produit | KPI Example | Montant |
|---|---|---|
| **Cartes** | 16 166 cartes | - |
| **Virements** | 348 640€ | Par canal (Web, Mobile) |
| **Comptes** | 68 831 comptes | 711 435.15 KC |
| **Épargne** | 25 529 contrats | 358 041,26 KC |
| **Crédits** | 12 001 immobilier + 484 conso | - |
| **Assurance** | 21 045 contrats | 2 193,99 M€ |

### Visualisations utilisées
- Grille de cartes (une par produit)
- Subdivisions par sous-type (ex: crédit immobilier vs consommation)
- Tables de détails (nombres, montants)
- Nombres grands et lisibles

### Points clés
- **Une carte par produit** pour clarté
- Montants en **devises mixtes** (€, KC, M€)
- Structure **tabellaire et numérique**
- Focus sur **volume et montants**

---

## Thème 3 : Engagement Numérique Avancé

### Objectif
Analyse détaillée de l'utilisation des canaux numériques et évolution temporelle.

### Indicateurs suivis
- Connexions uniques par jour
- Répartition par type de device (Web, Mobile iOS, Android)
- Évolution sur période (plusieurs mois)
- Tendances et pics d'activité

### Visualisations utilisées
- **Graphiques linéaires** : évolution temporelle (axe X : dates, axe Y : nombre connexions)
- **Pie charts** : répartition des utilisateurs
- **Codes couleur** : marron/bordeaux pour catégories
- **Grille de connexions** par canal (Web, Mobile, iOS)

### Points clés
- Données **granulaires par jour** (pas seulement un total)
- **Évolutions visibles** (pics, creux)
- **Plusieurs périodes** suivies
- Palette de couleurs **marron/bordeaux** (marque)

---

## Recommandations pour nouvelle architecture

### Consolider les 3 thèmes en 1 dashboard composite

1. **En-tête** : Synthèse globale (Clients, Enrôlés, Connexions)
2. **Section digitale** : Connexions par canal + graphique temporel
3. **Section produits** : Grille des 6 produits bancaires
4. **Graphiques complémentaires** : Tendances, répartition
5. **Filtres** : Période, canal, produit

### Esthétique recommandée
- **Palette** : Marron/Bordeaux (#6b3a3a, #c9453a) + Gris clair
- **Typographie** : Sans-serif moderne (Inter, Segoe UI)
- **Espacements** : Larges, aéré
- **Cards** : Bordures fines, ombres légères
- **KPI** : Gros nombres, labels clairs

### Flux d'utilisation
1. Utilisateur arrive → voit synthèse globale en haut
2. Scroll → consulte détails digitaux
3. Scroll → consulte portefeuille produits
4. Filtre ou drill-down si besoin

---

## Fichiers générés

- `board_realiste.html` : Maquette basée sur ces thèmes réels
- `board_maquettes.html` : Version avec structure complète
- `board_visual.html` : Version graphique pure

---

## Conclusion

Les anciens boards suivaient une **approche produit-centric** avec un **focus digital**. 

Pour évoluer vers une solution Power BI ou Qlik, il faut conserver cette **philosophie**, tout en ajoutant :
- Filtres interactifs
- Drill-down par segment/client
- Mises à jour temps réel
- Export de rapports
