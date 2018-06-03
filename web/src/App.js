import React, { Component } from 'react';
import socketio from 'socket.io-client';
import tileset from './assets/grass.png';
import hero from './assets/hero.png';

const serverUrl = () =>
  process.env.REACT_APP_ENV === 'web'
    ? 'http://13.124.104.170:3001'
    : 'http://13.124.104.170:3001';

class App extends Component {
  constructor() {
    super();
    this.canvas = null;
    this.img = {
      tileset: window.document.createElement('img'),
      hero: window.document.createElement('img'),
    };
    this.img.tileset.setAttribute('src', tileset);
    this.img.hero.setAttribute('src', hero);

    this.users = [];

    this.io = socketio(serverUrl());
    this.io.on('users', json => {
      const users = JSON.parse(json);
      if (this.users.length === 0) {
        this.users = users;
        this.me = users[0];
      } else {
        for (let index = 0; index < users.length; index += 1) {
          const remoteUser = users[index];
          const localUser = this.users.find(
            each => each.name === remoteUser.name,
          );
          if (localUser) {
            localUser.x = remoteUser.x;
            localUser.y = remoteUser.y;
          } else {
            this.users.push(remoteUser);
          }
        }
      }
    });
    this.io.emit('chat message', 'hello');
    this.io.on('chat message', msg => {
      window.console.log(msg);
    });
  }
  componentDidMount() {
    window.document.body.onresize = this.prepare;
    window.document.onkeydown = this.onKeyDown;
    this.prepare();
  }

  onKeyDown = event => {
    if (!this.me) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        this.me.x -= 1;
        break;
      case 'ArrowRight':
        this.me.x += 1;
        break;
      case 'ArrowUp':
        this.me.y -= 1;
        break;
      case 'ArrowDown':
        this.me.y += 1;
        break;
      default:
        break;
    }
    this.io.emit('move', JSON.stringify(this.me));
  };

  prepare = () => {
    this.size = {
      width: window.document.body.clientWidth,
      height: window.document.body.clientHeight,
    };
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.draw();
  };

  draw = () => {
    const ctx = this.canvas.getContext('2d');

    for (let y = 0; y < Math.ceil(this.size.height / 32); y += 1) {
      for (let x = 0; x < Math.ceil(this.size.width / 32); x += 1) {
        ctx.drawImage(this.img.tileset, 0, 0, 32, 32, x * 32, y * 32, 32, 32);
      }
    }
    for (let index = 0; index < this.users.length; index += 1) {
      const one = this.users[index];
      ctx.fillText(one.name, one.x * 32, one.y * 32);
      ctx.drawImage(
        this.img.hero,
        0,
        0,
        32,
        48,
        one.x * 32,
        one.y * 32,
        32,
        48,
      );
    }
    setTimeout(this.draw, 64);
  };
  render() {
    return <canvas ref={canvas => (this.canvas = canvas)} />;
  }
}

export default App;
