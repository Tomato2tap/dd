# Propositions de boards et tests

## Contexte
Cette proposition se base sur :
- `qlik table/constat.md`
- `/workspaces/dd/WIP/resultat.md`
- les fichiers texte présents dans `qlik table` :
  - `table client.txt`
  - `table transaction.txt`
  - `tableepargne.txt`
  - `tablecredit.txt`
  - `tableservice.txt`
  - `tble garantie.txt`
  - `table gsm.txt`

Les anciens PDF sont image-only, donc la conception repose sur les données disponibles et les besoins détectés.

---

## Board 1 : Risque & Conformité

### Objectif
Permettre aux équipes conformité et AML de détecter rapidement :
- les clients à risque
- les transactions suspectes
- les activités vers pays sensibles
- les événements liés aux sanctions et aux contrôles réglementaires

### Sources de données
- `table transaction.txt`
- `table client.txt`
- `table credit.txt`
- `tble garantie.txt`

### Indicateurs clés (KPI)
- Volume total des transactions (`mnt_evt`, `mnt_devise`)
- Nombre de transactions à risque pays élevé (`cli_top_pays_embargo`, `cli_top_pays_sanctions`, `ctrpty_top_pays_embargo`)
- Nombre de clients à risque ou bloqués (`cd_typ`, `etat_acc`, `stt_cnt`, `cd_risque`)
- Montant des transactions 3DS / sans contact / mode de paiement (`ind_3ds`, `ind_sans_contact`, `typ_paiement`)
- Assurance de conformité IFRS9 sur les crédits et garanties (`cd_bck_ifrs9`, `mnt_prov_b_ifrs9`, `mnt_prov_hb_ifrs9`, `mnt_rwa`)

### Visualisations recommandées
- Carte de chaleur des montants par pays client vs pays contrepartie
- Histogramme des types d’événements (`typ_evt`, `typ_evt_lv1`, `typ_evt_lv2`)
- Graphique linéaire du montant total des événements dans le temps (`dt_demande`, `dt_validation`, `dt_realisation`)
- Table détaillée des transactions sensibles avec filtre par client, pays et produit

### Filtres
- Période / mois
- Type client (`cd_typ`)
- Statut client (`stt_cnt`, `etat_acc`)
- Pays client / pays contrepartie (`cli_cd_pays_iso`, `ctrpty_cd_pays_iso`)
- Canal / mode paiement
- Niveau de risque pays

### Tests proposés
- Vérifier qu’un filtre pays embarqué affiche les transactions où `cli_top_pays_embargo` ou `ctrpty_top_pays_embargo` est vrai.
- Vérifier qu’un KPI de transaction 3DS compte bien les lignes avec `ind_3ds = 1`.
- Vérifier la jointure client-transaction sur `id_cli` pour les statuts de client.

---

## Board 2 : Commercial / Relation Client

### Objectif
Aider les équipes commerciales à suivre :
- l’activité client
- l’utilisation des produits
- la segmentation par type de client et groupe de risque
- l’engagement avec les services bancaires

### Sources de données
- `table client.txt`
- `tableepargne.txt`
- `table credit.txt`
- `tableservice.txt`
- `table gsm.txt`

### Indicateurs clés
- Nombre de clients par type client (`cd_typ`)
- Nombre de clients actifs vs prospects (`cli_c_p`, `typ_rl`)
- Encours total par client et par produit (`enc_fds_m`, `enc_cnt_n_1`, `enc_cpt`, `enc_gest`, `mnt_nom`, `mnt_dblq`)
- Top produits par encours et par collecte
- Taux de pénétration des services et comptes associés (`fam_pdt`, `perimetre`, `stt_cnt`)

### Visualisations recommandées
- Diagramme en barres : répartition des clients par `cd_typ` et `groupe risque`
- Treemap des encours par produit et par catégorie `fam_pdt`
- Courbe d’évolution du nombre de clients actifs, prospects et comptes bloqués
- Table des clients avec plus gros encours et dernier contact / dernière connexion (`dt_der_cnx`)

### Filtres
- Type client et statut commercial
- Groupe de risque (`id_gr`, `lib_gr`)
- Agence ou périmètre
- Produit / famille produit
- Période de mise à jour

### Tests proposés
- Vérifier que le nombre de clients par type correspond à un décompte unique de `id_cli`.
- Vérifier que l’encours total affiché additionne `enc_fds_m`, `enc_cnt_n_1`, `enc_cpt` par client.
- Vérifier qu’une segmentation par `fam_pdt` conserve les contrats de crédit et épargne correctement.

---

## Board 3 : Crédit & Garanties

### Objectif
Suivre la santé du portefeuille de crédit et l’exposition garantie :
- montants crédités
- engagements débloqués
- provisions et états de prêts
- couverture par garanties et RWA

### Sources de données
- `table credit.txt`
- `tble garantie.txt`
- `table client.txt`

### Indicateurs clés
- Encours total des crédits (`mnt_nom`, `mnt_dblq`, `mnt_nom_proj`, `mnt_dblq_proj`)
- Nombre de contrats en contentieux / clos (`stt_cnt`, `cd_etat_prt`)
- Provisions IFRS9 et bucket B1/B2 (`mnt_prov_b_ifrs9`, `mnt_prov_hb_ifrs9`, `cd_bck_ifrs9`)
- Couverture par garantie (`mnt_gar`, `mnt_gar_cpta`, `tx_rwa`, `mnt_rwa`)
- Ratio prêts sains vs impayés (`mnt_krd_sain`, `mnt_krd_imp`)

### Visualisations recommandées
- Histogramme des contrats par état (`stt_cnt`, `cd_etat_prt`)
- Graphique à barres des montants débloqués vs montants nominaux
- Carte ou tableau des garanties par type et montant
- Matrice crédit/garantie avec ratio de couverture

### Filtres
- Statut du contrat / statut de garantie
- Type de prêt (`typ_prt`, `typ_mar`, `fam_pdt`)
- Agence et périmètre
- Date de début / échéance
- Bucket IFRS9

### Tests proposés
- Vérifier que les crédits en contentieux sont filtrés sur `stt_cnt = 8` ou `cd_etat_prt` correspondant.
- Vérifier que les garanties associées à un prêt s’agrègent bien par `num_cnt_prt`.
- Vérifier que la couverture garantie est calculée avec `mnt_gar_cpta / mnt_krd_tot` ou similaire.

---

## Board 4 : Épargne & Performance

### Objectif
Donner une vue sur l’épargne client, la performance des fonds et le risque des supports.

### Sources de données
- `tableepargne.txt`
- `table gsm.txt`
- `table client.txt`

### Indicateurs clés
- Encours total épargne (`enc_fds_m`, `enc_cnt_n_1`, `sum_enc_fds_cnt`, `sum_enc_fds_profil`)
- Collecte / décollète / collecte nette (`col_brute`, `decollecte`, `col_nette`)
- Volatilité et risque ISIN (`volatilite_isin`, `isin_risq`, `cd_risque`)
- Performance par gestionnaire (`performance_cli`, `lib_mod_gest`)
- Exposition durable SFDR (`ind_sfdr_*`)

### Visualisations recommandées
- Graphique des encours par profil et par gestionnaire
- Courbe collecte vs décollète
- Table des ISIN par encours et score de risque
- Diagramme de répartition SFDR

### Filtres
- Type de contrat / gestionnaire
- Code risque ISIN
- SFDR / taxonomie durable
- Période / année

### Tests proposés
- Vérifier le calcul de collecte nette : `col_brute + decollecte`.
- Vérifier que le top 10 ISIN montre bien les plus grands `enc_fds_m`.
- Vérifier que la segmentation SFDR utilise bien les champs `ind_sfdr_*`.

---

## Comparaison des boards
| Board | Objectif | Données principales | Indicateur prioritaire |
|---|---|---|---|
| Risque & Conformité | Surveiller les risques transactionnels et clients sensibles | `transaction`, `client`, `garantie` | Transactions pays à risque / AML |
| Commercial | Suivre l’activité client et l’utilisation produit | `client`, `épargne`, `service` | Encours client + segmentation par type |
| Crédit & Garanties | Piloter expositions prêt et couverture | `credit`, `garantie`, `client` | Encours crédit + provisions IFRS9 |
| Épargne & Performance | Analyser encours épargne et risque des supports | `épargne`, `gsm`, `client` | Collecte nette + volatilité ISIN |

---

## Plan de tests
1. **Test de cohérence client** : vérifier que `id_cli` existe dans les tables `client`, `transaction`, `épargne`, `credit`, `garantie`.
2. **Test de filtre pays** : vérifier que les transactions vers pays sensibles s’affichent avec `cli_top_pays_sanctions` ou `ctrpty_top_pays_embargo`.
3. **Test de KPI encours** : vérifier que l’encours total épargne calcule correctement `enc_fds_m` + `enc_cnt_n_1`.
4. **Test de conformité IFRS9** : vérifier que les montants IFRS9 apparaissent sur le board crédit et garantie.
5. **Test de segmentation commerciale** : vérifier que les clients par `cd_typ` et `lib_gr` correspondent aux totaux des données `client`.

---

## Recommandation immédiate
- Commencer par prototyper le board `Risque & Conformité`, car il utilise le plus de données disponibles et répond aux besoins urgents du banquier.
- Ensuite, faire un deuxième board `Commercial` pour couvrir la lecture métier et la navigation logique demandée dans `constat.md`.
- Ces deux boards constituent une base réutilisable pour enrichir `Crédit & Garanties` et `Épargne & Performance`.
