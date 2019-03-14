// @flow strict
'use strict';

/**
 * @fileOverview dev.js for development. Please run index.js
 *
 * @author Motone Adachi (waritocomatta)
 * @version 1.0.0
 */

import packInf from './package.json';
import { ArgumentParser } from 'argparse';
import puppeteer from 'puppeteer';
import Sequelize from 'sequelize';
import notifier from 'node-notifier';
import path from 'path';

type homeNameType = 'USERPROFILE' | 'HOME';
type fOrFType = 'followers' | 'following';

/**
 * for multi platform.
 * @type {homeNameType}
 */
const homeName: homeNameType = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
if (!process.env[homeName]) throw new TypeError('process.env.platform is null');

/**
 * this is path.
 * @type {string}
 */
const home: string = process.env[homeName];

/**
 * by <code>new ArgumentParser</code>
 * @type {Object}
 */
const parser: Object = new ArgumentParser({
  version: packInf.version,
  addHelp: true,
  description: packInf.description,
  argumentDefault: { flip: true }
});
parser.addArgument('--wait', { type: 'int', defaultValue: 30, help: 'this system wait for you login to twitter. please set seconds time of waiting. *default: 10s' });
parser.addArgument('--dbUser', { type: 'string', defaultValue: '', help: '' });
parser.addArgument('--dbPassword', { type: 'string', defaultValue: '', help: '' });
parser.addArgument('--dbLogging', { type: 'string', defaultValue: 'true', help: '' });

/**
 * by Argument (string | number)
 * @type {Object<string>}
 */
const args: {[string]: string | number} = parser.parseArgs();

/**
 * by <code>new Sequelize</code>
 * @type {Object}
*/
const sequelize: Object = new Sequelize('database', args.dbUser.toString(), args.dbPassword.toString(), {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, 'db', 'main.sqlite3'),
  logging: (args.dbLogging !== 'false'),
  operatorsAliases: false
});

/**
 * this is sequelize model.
 * @type {Object}
 */
const getTwFF: Object = sequelize.define('get-tw-ff', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING(200),
    unique: true,
    allowNull: false
  },
  icon: {
    type: Sequelize.STRING(200),
    unique: true,
    allowNull: false
  },
  following: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  followers: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, { freezeTableName: true, timestamps: false });

/**
 * this function accept legacy tw.
 * @param {Object} page by browser by puppeteer.
 */
const legacyTwYes: Function = async (page: Object) => {
  const selector: string = 'button[type="submit"]';
  const yesBtnLen: number = parseFloat(await page.$$eval(selector, elms => elms.length));
  if (yesBtnLen === 0) return;
  page.click(selector);
  await page.waitForNavigation({ timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.reload({ timeout: 60000, waitUntil: 'domcontentloaded' });
};

/**
 * this function click link of "use this" in page.
 * @param {Object} page by browser by puppeteer.
 */
const useThisLinkClick: Function = async (page: Object) => {
  if (!await page.$('center')) return;
  page.$eval('center>a', elm => { location.href = elm.href; });
  await page.waitForNavigation({ timeout: 60000, waitUntil: 'domcontentloaded' });
};

/**
 * This function call legacyTwYes and useThisLinkClick.
 * @param {Object} browser by puppeteer
 * @param {fOrFType} fOrF 'following' or 'followers'
 * @see legacyTwYes
 * @see useThisLinkClick
 */
const legacyTwYesAndUseThisLinkClick: Function = async (page: Object) => {
  await legacyTwYes(page);
  await useThisLinkClick(page);
};

/**
 * count of called finish sequence.
 * @type {number}
 */
let countOfCalledFinishSequence: number = 0;

/**
 * this function exit this system<br>
 * when two called.
 */
const finishSequence: Function = () => {
  countOfCalledFinishSequence++;
  if (countOfCalledFinishSequence < 2) return;
  notifier.notify({ title: packInf.name, message: 'finish.' });
  process.exit(1);
};

/**
 * this function get info of following and followers.<br>
 * and, save it to database.
 * and, move to next page.
 * if moved page is last page, call finishSequence
 * @param {Object} page by browser by puppeteer.
 * @param {fOrFType} fOrF 'following' or 'followers'
 * @see finishSequence
 */
const scroll: Function = async (page: Object, fOrF: fOrFType) => {
  const ffInf: {usernames: string[], icons: string[], followings: boolean[]} = await page.$$eval('.user-item', (elms: Object[]) => {
    let ffInf: {usernames: string[], icons: string[], followings: boolean[]} = { usernames: [], icons: [], followings: [] };
    for (let elm: Object of elms) {
      ffInf.usernames.push(elm.getElementsByClassName('username')[0].innerText.replace('@', ''));
      ffInf.icons.push(elm.getElementsByClassName('profile-image')[0].src.replace('https://pbs.twimg.com/profile_images/', '').replace(/_normal\.jpe?g$/, ''));
      ffInf.followings.push(elm.getElementsByClassName('w-button-common')[0].classList[1] === 'w-button-unfollow');
    }
    return ffInf;
  });
  const ffInfIconsLen: number = ffInf.icons.length;
  for (let i: number = 0; i < ffInfIconsLen; i++) {
    getTwFF.findOne({ where: Sequelize.or({ username: ffInf.usernames[i] }, { icon: ffInf.icons[i] }) }).then(account => {
      if (account) {
        account.username = ffInf.usernames[i];
        account.icon = ffInf.icons[i];
        account.following = ffInf.followings[i];
        if (fOrF === 'followers' && !account.followers) { account.followers = true; }
        account.save();
      } else {
        getTwFF.create({
          username: ffInf.usernames[i],
          icon: ffInf.icons[i],
          following: fOrF === 'following',
          followers: fOrF === 'followers'
        });
      }
    });
  }
  const selector: string = '.w-button-more a';
  const selectorCount: number = parseFloat(await page.$$eval(selector, elms => elms.length));
  if (selectorCount === 1) {
    await page.click(selector);
    await page.waitForSelector('body');
    await scroll(page, fOrF);
    return;
  }
  finishSequence();
};

/**
 * this function create new pages of followers list or followings list.<br>
 * this function call legacyTwYesAndUseThisLinkClick function.<br>
 * because, twitter show pages of some confirm.<br>
 * after that, call scroll function.
 * @param {Object} browser by puppeteer
 * @param {fOrFType} fOrF 'following' or 'followers'
 * @see legacyTwYesAndUseThisLinkClick
 * @see scroll
 */
const newFOrFPage: Function = async (browser: Object, fOrF: fOrFType) => {
  const page: Object = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  await page.on('request', interceptedRequest => {
    const interceptedRequestUrl = interceptedRequest.url();
    if (interceptedRequestUrl.endsWith('.mp4') ||
      interceptedRequestUrl.endsWith('.MP4') ||
      interceptedRequestUrl.endsWith('.png') ||
      interceptedRequestUrl.endsWith('.PNG') ||
      interceptedRequestUrl.endsWith('.jpg') ||
      interceptedRequestUrl.endsWith('.JPG') ||
      interceptedRequestUrl.endsWith('.jpeg') ||
      interceptedRequestUrl.endsWith('.JPEG') ||
      interceptedRequestUrl.endsWith('.jpg:small') ||
      interceptedRequestUrl.endsWith('.gif') ||
      interceptedRequestUrl.endsWith('.GIF') ||
      interceptedRequestUrl.endsWith('.ico') ||
      interceptedRequestUrl.endsWith('.ICO') ||
      interceptedRequestUrl.endsWith('.svg') ||
      interceptedRequestUrl.endsWith('.SVG') ||
      interceptedRequestUrl.endsWith('.css') ||
      interceptedRequestUrl.endsWith('.CSS') ||
      interceptedRequestUrl.endsWith('.woff') ||
      interceptedRequestUrl.endsWith('.WOFF')) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });
  await page.goto('https://mobile.twitter.com/', { waitUntil: 'domcontentloaded' });
  await legacyTwYesAndUseThisLinkClick(page);
  if (!await page.$('.home')) {
    await notifier.notify({ title: packInf.name, message: 'please login.' });
    await page.waitFor(parseFloat(args.wait) * 1000);
  }
  await page.goto('https://mobile.twitter.com/account/', { waitUntil: 'domcontentloaded' });
  await legacyTwYesAndUseThisLinkClick(page);
  await page.goto(`https://mobile.twitter.com/${await page.$eval('.screen-name', elm => elm.innerText)}/${fOrF}`, { waitUntil: 'domcontentloaded' });
  await legacyTwYesAndUseThisLinkClick(page);
  await scroll(page, fOrF);
};

(async () => {
  const browser: Object = await puppeteer.launch({
    headless: false,
    args: ['--window-size=550,700', '--window-position=50,50'],
    userDataDir: path.resolve(home, 'get-tw-app')
  });
  await getTwFF.update({ followers: false }, { where: {} }).then(() => {
    for (let fOrF: fOrFType of ['following', 'followers']) newFOrFPage(browser, fOrF);
  });
})();
