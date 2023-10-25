# Sero server managing tool

This is a cli tool for managing sites hosted with [sero server](https://github.com/clowzed/sero)

# Installation

```
npm i -g sero
```

## Usage

Run `sero --help` to see help messages

```
Usage: run [options] [command]

Options:
  -l, --level <level>                 set log level
  -h, --help                          display help for command

Commands:
  init     [directory]                Create default sero.toml in the specified directory
  enable   [directory]                Enable site from specified directory
  disable  [directory]                Disable site from specified directory
  teardown [directory]                Delete site. Subdomain wil be freed
  register [directory]                Register user from sero.toml
  download [directory] [destination]  Download site from specified directory
  upload   [directory]                Upload site from specified directory
  help     [command]                  display help for command
```

## Features

- Custom 404.html will be returned if requested page was not found
- Custom 503.html **new**
- Enable and disable site **new** (503 status will be returned with 503.html if provided)
- Download site new **new**
- Teardown site

## Explanation

1. Create a directory for your site and cd into it

```
mkdir /mysite
cd /mysite
```

2. Initialize sero.toml

```
sero init
```

3. Modify sero.toml the way you want
4. Upload your site to sero server

```
sero upload
```

5. If you want to disable site without freeing subdomain

```
sero disable
```

This will return 503 Status Code and your 503.html if you created it

6. To enable site

```
sero enable
```

7. If you want to download site back as zip file

```
sero download
```

8. If you do not like your site anymore

```
sero teardown
```
