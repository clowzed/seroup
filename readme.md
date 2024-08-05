# Seroup

Seroup is a CLI management tool for [sero](https://github.com/clowzed/sero) servers, allowing you to easily upload and manage site on this server.
The last version of this tool is guaranteed to work with latest stable release of sero server.

## Table of Contents

- [Seroup](#seroup)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Commands](#commands)
  - [Configuration](#configuration)

## Installation

To install `seroup`, use pip:

```sh
pip install seroup
```

## Usage

After installation, you can use the seroup command followed by various subcommands.

```sh
seroup <command> <directory (default: current directory)>
```

## Commands

| Command        | Description                                       |
| -------------- | ------------------------------------------------- |
| `init`         | Create default `sero.toml` in specified directory |
| `enable`       | Enable site                                       |
| `disable`      | Disable site                                      |
| `download`     | Download full site as zip                         |
| `upload`       | Upload site                                       |
| `teardown`     | Teardown site                                     |
| `ucors`        | Update CORS settings without reuploading site     |
| `registration` | Register a user in sero server                    |

## Configuration

The tool uses a configuration file named `sero.toml` to manage site settings. Below is an example configuration:

```toml
Copy code
[server]
url = "http://mysite.ru"
subdomain = "blog"

[cors]
origins = []

[credentials]
login = "clowzed"
# For security reasons
# you'd better keep this empty
password = ""
```

Configuration Sections

- [server]: Contains the server URL and subdomain.
  - url: The base URL of the server.
  - subdomain: The subdomain for the site.
- [cors]: Contains CORS settings.
  - origins: A list of allowed origins for CORS.
- [credentials]: Contains login credentials.
  - login: The login username.
  - password: The login password.
