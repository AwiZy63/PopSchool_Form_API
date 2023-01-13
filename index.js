const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { encryptPassword, generateJwt } = require("./utils");

const app = express();

const port = 3030;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    try {
        res.send("<pre>Welcome to our API !</pre>")
    } catch (error) {
        res.send(`<pre>Error : ${error}</pre>`)
        console.error(error);
    }
});

app.post('/', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        console.log(name, email, phone, password)
        if (!req.body || !name || !email || !phone || !password) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide."
            });
        }

        if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(email)) {
            return res.status(400).json({
                error: true,
                message: "L'adresse email est incorrecte."
            });
        }

        // Encryption password
        const encryptedPassword = await encryptPassword(password);

        const userData = {
            name: name,
            email: email,
            phone: phone
        }

        // if (Object.values(userData).length !== 4) {
        //     return res.status(500).json({
        //         error: true,
        //         message: "Une erreur est survenue, veuillez réessayer plus tard."
        //     });
        // }

        // JWT Token
        const token = await generateJwt(userData);

        return res.status(200).json({
            error: false,
            message: "Votre compte a bien été créé.",
            userData: userData,
            userToken: token,
            encryptedPassword: encryptedPassword
        });
    } catch (error) {
        return {
            error: true,
            message: error
        }
    }
})

// app.post('/', async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, confirmPassword } = req.body;

//         if (!req.body || !firstName || !lastName || !email || !password || !confirmPassword) {
//             return res.status(400).json({
//                 error: true,
//                 message: "Requête invalide."
//             });
//         }

//         if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(email)) {
//             return res.status(400).json({
//                 error: true,
//                 message: "L'adresse email est incorrecte."
//             });
//         }


//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 error: true,
//                 message: "Les deux mots de passe ne correspondent pas."
//             });
//         }
//         // Encryption password
//         const encryptedPassword = await encryptPassword(password);

//         const userData = {
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             password: encryptedPassword,
//         }

//         if (Object.values(userData).length !== 4) {
//             return res.status(500).json({
//                 error: true,
//                 message: "Une erreur est survenue, veuillez réessayer plus tard."
//             });
//         }

//         // JWT Token
//         const token = userData;

//         // Vérification erreurs


//         return res.status(200).json({
//             error: false,
//             message: "Votre compte a bien été créé.",
//             userData: userData,
//             userToken: token
//         });
//     } catch (error) {
//         return {
//             error: true,
//             message: error
//         }
//     }
// })

app.listen(port, () => {
    try {
        console.log(`API started at port : ${port} !`)
    } catch (error) {
        console.error(error);
    }
});