import fs from 'fs'
import inline from 'web-resource-inliner'

inline.html(
    {
        fileContent: readFileSync("./dist/dashboard.example.html"),
        relativeTo: "./dist",
    },
    (err, result) => {
        if (err) { throw err }
        fs.writeFileSync("./dist/inline.html", result)
    }
)


function readFileSync(file) {
    const contents = fs.readFileSync(file, "utf8")
    return process.platform === "win32" ? contents.replace(/\r\n/g, "\n") : contents
}