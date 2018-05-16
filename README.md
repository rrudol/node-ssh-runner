# node-ssh-runner
Run your project remotely on multiple hosts using SSH

```
node index.js -n 1 -h <hosts>.json <script file>
```

Example `hosts.json`
```
[
  {
    "host": "ec2-54-224-162-72.eu-west-1.compute.amazonaws.com",
    "username": "ubuntu",
    "port": 22,
    "privateKey": "/Users/john/r.pem",
    "remotePath": "/home/ubuntu"
  },
  {
    "host": "ec2-54-219-162-72.eu-west-1.compute.amazonaws.com",
    "username": "ubuntu",
    "port": 22,
    "privateKey": "/Users/john/r.pem",
    "remotePath": "/home/ubuntu"
  },
  {
    "host": "ec2-54-229-262-52.eu-west-1.compute.amazonaws.com",
    "username": "ubuntu",
    "port": 22,
    "privateKey": "/Users/john/r.pem",
    "remotePath": "/home/ubuntu"
  }
]
```
