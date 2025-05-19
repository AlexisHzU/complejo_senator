import {app} from "./src/main.js"
import {port} from './src/utils/keys.js'

app.listen(port, () => {
    console.log(`server abierto en el puerto: ${port}`)
})
