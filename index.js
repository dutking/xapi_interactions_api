const path = require('path');
const fsoriginal = require('fs');
const fs = require('fs-extra');
const util = require('util');
const HTMLParser = require('node-html-parser');
const AdmZip = require('adm-zip');

let allFiles = [];
let allImages;
let pages = [];
let pagesData = [];
let allDb = [];
let trackEngName = 'UrbanLeader';

let date = new Date();
let mm = Number(date.getMinutes()).toLocaleString({ minimumIntegerDigits: 2 });
let hh = Number(date.getHours()).toLocaleString({ minimumIntegerDigits: 2 });
let day = Number(date.getDate()).toLocaleString({ minimumIntegerDigits: 2 });
let month = (Number(date.getMonth()) + 1).toLocaleString({
    minimumIntegerDigits: 2,
});
let year = Number(date.getFullYear());
let folderDate = `${year}_${month}_${day}_${hh}_${mm}`;

let projectFolder = `${trackEngName}__${folderDate}`;

fs.readdir('in')
    .then((files) => {
        console.log(files);
        fs.ensureDirSync(path.join('_output', projectFolder, 'temp'));
        fs.ensureDirSync(path.join('_output', projectFolder, 'packages'));
        files.forEach((f) => {
            if(f !== '.DS_Store'){
                let zip = new AdmZip(path.join('in', f));
                let extract = util.promisify(zip.extractAllTo);
                if (f.includes('project')) {
                    extract(path.join('_output', projectFolder, 'temp'), true);
                } else if (f.includes('data')) {
                    extract(path.join('_output', projectFolder, 'packages'), true);
                }
            }
        });
    })
    .then(() => fs.readdir(path.join('_output', projectFolder, 'temp')))
    .then((dir) =>
        fs.rename(
            path.join('_output', projectFolder, 'temp', dir[0]),
            path.join('_output', projectFolder, 'temp', 'project')
        )
    )
    .then(() =>
        fs.readdir(
            path.join('_output', projectFolder, 'temp', 'project', 'images')
        )
    )
    .then((res) => {
        allImages = res;
    })
    .then(() =>
        fs.readdir(path.join('_output', projectFolder, 'temp', 'project'))
    )
    .then((projectFiles) => {
        allFiles = projectFiles;
        pages = projectFiles.filter((f) => f.includes('page'));
        return pages.map((f) =>
            fs.readFile(
                path.join('_output', projectFolder, 'temp', 'project', f),
                'utf-8'
            )
        );
    })
    .then((res) => Promise.all(res))
    .then((filedata) => filedata.map((f) => getData(f)))
    .then((res) => Promise.all(res))
    .then((data) => data.map((d) => changeData(d)))
    .then((res) => Promise.all(res))
    .then(() =>
        pagesData.map((d) =>
            fs.copy(
                path.join('_output', projectFolder, 'temp', 'project', 'css'),
                path.join(
                    '_output',
                    projectFolder,
                    'packages',
                    d.number,
                    'content',
                    'css'
                )
            )
        )
    )
    .then((res) => Promise.all(res))
    .then(() =>
        pagesData.map((d) =>
            fs.copy(
                path.join('_app'),
                path.join(
                    '_output',
                    projectFolder,
                    'packages',
                    d.number,
                    'content',
                    '_app'
                )
            )
        )
    )
    .then((res) => Promise.all(res))
    .then(() => fs.readdir(path.join('_toInsert')))
    .then((folders) =>
        folders.map((f) =>
            fs.copySync(
                path.join('_toInsert', f),
                path.join('_output', projectFolder, 'packages', f)
            )
        )
    )
    .then((res) => Promise.all(res))
    .then(() =>
        pagesData.map((d) =>
            fs.copy(
                path.join(
                    '_output',
                    projectFolder,
                    'temp',
                    'project',
                    'files',
                    `${d.fileName.split('.')[0]}body.html`
                ),
                path.join(
                    '_output',
                    projectFolder,
                    'packages',
                    d.number,
                    'content',
                    'files',
                    `${d.fileName.split('.')[0]}body.html`
                )
            )
        )
    )
    .then((res) => Promise.all(res))
    .then(() =>
        pagesData.map((d) =>
            fs.copy(
                path.join('_output', projectFolder, 'temp', 'project', 'js'),
                path.join(
                    '_output',
                    projectFolder,
                    'packages',
                    d.number,
                    'content',
                    'js'
                )
            )
        )
    )
    .then((res) => Promise.all(res))
    /* .then(() =>
        pagesData.map((d) => {
            if (fsoriginal.existsSync(path.join("img", d.number))) {
            let dir = fs.readdirSync(path.join("img", d.number));
            console.log(dir);
            dir.forEach((file) =>
                fs.copySync(
                    path.join("img", d.number, file),
                    path.join(
                        "output",
                        projectFolder,
                        d.number,
                        "_app",
                        "img",
                        file
                    )
                )
            );}
        })
    ) */
    /* .then(() =>
        pagesData.map((d) => {
            if (fsoriginal.existsSync(path.join("img", d.number))) {
                fs.readdir(path.join("img", d.number)).then((folder) =>
                    folder.map((f) =>
                        fs.copySync(
                            path.join("img", d.number, f),
                            path.join(
                                "output",
                                projectFolder,
                                d.number,
                                "_app",
                                "img",
                                f
                            )
                        )
                    )
                );
            }
        })
    )
    .then((res) => Promise.all(res)) */
    /* .then(() =>
        pagesData.map((d) => {
            if (fsoriginal.existsSync(path.join("files", d.number))) {
                fs.readdir(path.join("files", d.number)).then((folder) =>
                    folder.map((f) =>
                        fs.copySync(
                            path.join("files", d.number, f),
                            path.join(
                                "output",
                                projectFolder,
                                d.number,
                                "_app",
                                "files",
                                f
                            )
                        )
                    )
                );
            }
        })
    )
    .then((res) => Promise.all(res)) */
    .then(() =>
        pagesData.map((d) =>
            Promise.all(
                d.images.map((i) =>
                    fs.copy(
                        path.join(
                            '_output',
                            projectFolder,
                            'temp',
                            'project',
                            'images',
                            i
                        ),
                        path.join(
                            '_output',
                            projectFolder,
                            'packages',
                            d.number,
                            'content',
                            'images',
                            i
                        )
                    )
                )
            )
        )
    )
    .then((res) => Promise.all(res))
    .then(() => fs.ensureDir(path.join('_output', projectFolder, 'zip')))
    .then(() => fs.readdir(path.join('_output', projectFolder, 'packages')))
    .then((res) => Promise.all(res.map((folder) => zipFolder(folder))))
    .then(() => console.log(folderDate))
    .catch((err) => console.log(err));

function zipFolder(f) {
    let zip = new AdmZip();
    zip.addLocalFolder(path.join('_output', projectFolder, 'packages', f));
    zip.writeZip(path.join('_output', projectFolder, 'zip', `${f}.zip`));
}

function changeData(data) {
    let doc = fs.readFileSync(
        path.join('_output', projectFolder, 'temp', 'project', data.fileName)
    );
    let html = HTMLParser.parse(doc, {
        lowerCaseTagName: false,
        comment: false,
    });
    let title = html.querySelector('title');
    title.set_content(data.courseName);

    let head = html.querySelector('head');
    let headData = head.innerHTML;
    let headScripts = `
    <link rel="stylesheet" href="_app/style.css" />
    <link rel="stylesheet" href="_app/custom.css" />
    <script src="_app/moment.js" defer></script>
    <script src="_app/verbs.js" defer></script>
    <script src="_app/xapiwrapper.min.js" defer></script>
    <script src="_app/db.js" defer></script>
    <script src="_app/config.js" defer></script>
    <script type="module" src="_app/app.js" defer></script>`;

    head.set_content(headData + headScripts);

    if (html.querySelector('#tildacopy')) {
        html.querySelector('#tildacopy').remove();
    }
    let scripts = html.querySelectorAll('script');
    scripts[scripts.length - 1].remove();

    return fs.outputFile(
        path.join(
            '_output',
            projectFolder,
            'packages',
            data.number,
            'content',
            'index.html'
        ),
        html.toString(),
        'utf-8'
    );
}

function getData(html) {
    let htmldata = HTMLParser.parse(html, {
        lowerCaseTagName: false,
        comment: true,
        blockTextElements: {
            script: true,
            noscript: true,
            style: true,
            pre: true,
        },
    });

    let title = htmldata.querySelector('title').innerHTML;
    console.log(title);

    let fileName =
        'page' +
        htmldata
            .querySelector('#allrecords')
            .getAttribute('data-tilda-page-id') +
        '.html';

    console.log(fileName);

    /* let meta = Array.from(htmldata.querySelectorAll("meta")).filter(
        (m) => m.getAttribute("name") === "keywords"
    );

    trackEngName = meta
        .filter((m) => m.getAttribute("content").includes("track_id:"))[0]
        .getAttribute("content")
        .split("track_id:")[1]; */

    let string = htmldata.toString();
    let images = allImages.filter((i) => string.includes(i));

    let data = {
        fileName: fileName,
        courseName: title.split('_')[1],
        number: title.split('_')[0],
        images: images,
    };

    if (!data.number.includes('X')) {
        pagesData.push(data);
    }

    return new Promise((resolve, reject) => {
        resolve(data);
    });
}
