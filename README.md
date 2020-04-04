Installer :
- node
- yarn
- git

Installer les modules globaux via yarn : yarn global add typescript eslint ts-node
Si nécessaire ajouter le chemin des modules globaux (obtenu via yarn global bin) au PATH

Ajouter un fichier env.js à la racine du projet avec le contenu suivant en renseignant l'URI d'une base de données MongoDB valide qui contien une collection vide nommée 'games' :
	export default {
		MONGODB_URI: 'mongodb://....',
	};



Pour développer lancer 3 bash :
 - watching ts (recompiler automatiquement le serveur) : npm run wts
 - watching node (relancer automatiquement le serveur): npm run wn
 - webpack dev server : npm run wds

Playground local : http://localhost:3000/graphql
App locale via webpack dev server : http://localhost:9000/

Lancer le serveur local buildé (via npm run bn) : npm run start
App locale buildée (via npm run bw) et servie par le serveur local : http://localhost:3000/


L'application est déployée et utilisable sur heroku :
	Playground de prod : https://ptitecoinche.herokuapp.com/graphql
	App de prod : https://ptitecoinche.herokuapp.com