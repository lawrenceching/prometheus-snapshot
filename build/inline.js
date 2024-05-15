import fs from 'fs'
import inline from 'web-resource-inliner'
import packageJson from "../package.json" assert { type: "json" }

const conf = packageJson["web-resource-inliner"]
const { source, destination } = conf;

const destDir = './dist'

if(!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
}

inline.html(
    {
        fileContent: readFileSync(source),
        relativeTo: "./",
    },
    (err, result) => {
        if (err) { throw err }
        fs.writeFileSync(destination, result)
    }
)

function readFileSync(file) {
    const contents = fs.readFileSync(file, "utf8")
    return process.platform === "win32" ? contents.replace(/\r\n/g, "\n") : contents
}