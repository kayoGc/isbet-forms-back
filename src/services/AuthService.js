/**
 * Aqui é usado o firebase SDK, vamos usar o firebase authenticator para lidar com usuários
 */
import { initializeApp } from 'firebase-admin/app';
import admin from "firebase-admin";
// importa as credenciais do firebase
import serviceAccountKey from '../../serviceAccountKey.json' with { type: 'json' };

// inicia a aplicação do firebase
initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

class AuthService {
    // inicia a instancia do auth
    auth = admin.auth()

    // vai criar um novo usuário
    async createNewUser(email, password, name) {
        try {
            const result = await this.auth.createUser({ email: email, password: password, displayName: name }); 

            return { success: true, uid: result.uid };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    // vai verificar o token mandado pelo cliente
    async verifyIdToken(idToken) {
        try {
            // verifica o token
            const decodedToken = await this.auth.verifyIdToken(idToken);

            // retorna os dados do usuário
            return decodedToken;
        } catch (err) {
            console.error("Erro verificando identidade", err.message);

            throw new Error("Not authenticated");
        }
    }

    /**
     * Pega dados de usuários no firebase através de identificadores. 
     * 
     * É possível pegar até 100 usuários de uma vez.
     * 
     * Retorna um array de objetos, cada objeto possui o uid, name e email do usuário achado
     * @param {Array} identifiers Array contendo identificadores de cada usuário que quer achar
     */
    async getUsers(identifiers) {
        try {
            const result = await this.auth.getUsers(identifiers);

            let users = [];
            result.users.forEach((user) => {
                
                users.push({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email
                })

            });

            return { success: true, users: users };
        } catch (err) {
            return { success: false, error: `AuthService error: ${err.message}`};
        }

    }
}

const authService = new AuthService();
export default authService;