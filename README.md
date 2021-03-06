# get-tw-ff

this CLI tools get your twitter account followings list and followers list.  
this CLI tools access and login to your twitter account at using puppeteer.  
in <https://mobile.twitter.com/> \*javascript: off

## usage

```javascript
parser.addArgument('--wait', {type: 'int', defaultValue: 30, help: 'this system wait for you login to twitter. please set seconds time of waiting. *default: 10s'});
parser.addArgument('--dbUser', {type: 'string', defaultValue: '', help: ''});
parser.addArgument('--dbPassword', {type: 'string', defaultValue: '', help: ''});
parser.addArgument('--dbLogging', {type: 'string', defaultValue: 'true', help: ''});
```

# [.commit_template](.commit_template)

```bash
git config commit.template .commit_template
```

by [https://github.com/carloscuesta/gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)
```bash
gitmoji -l
```

# development

![uml](http://www.plantuml.com/plantuml/svg/TPL1RzmW48Nl_8fHJkt1ZjAgKjL3b5R9iPTU8wjYpNYN11W7njbDg_pt6anODyYtmFlcCMIUsPl0qlDaZJ0uC321r_i3Wz8UUzRa16is20gVqT1eqR4Gz_EgVGYTSCIO2xx1G7wDjJFtw-xxxS-xrgfEtDF4bzefFBK7jgOJOY2ZqCE56otuoJMXztha2_Wh0Eu7GyTE0AGJTiHCTZwYFs3_2Fmo8aYd8BmubYT0xjiPZMLHocNdnhGToJDOKfF10D5wyT1ke5R4kftSeQaA4zcJGc0235yMzYYvFrHiSe2anPDmONkoe-nvWyxgYdy8Ylek_UbHAbjVnah_gEZeW0P8z5B86AfJehzsUmX4Rg7Ii2lCnHiketa8ubLiZGPIENn8VFCCbvVm_BMzkce_VSnJUpEf_vFaev6RsqcTACbo9mF2HNWocl4ptFvOF6QNFNB3nsOOeirhn4i_fF1tdcF1fT-FqWVibkKG6ZonbtavJkE8ZEZpEbeqZbWFkkm5V9hGw3zl5hcdwlZ-uCdgoLxlF1q3-jB231WwpfSBCCezTkjTz7apkRsUlnves-iSz1BITsAAoQQQmhQbbkYTTP7zabvc5G4y9I0xRkh5SvCGPJCn9SNd9ifEaii3aGWNiFR8gIqMDP2_cZEGDvBuxjs9LEzHCWgncZiqpMhiecIglcave-Hi6odPssRUvN6RAxrkC-K2cyGAQU8ZqlptiQqRBdeLxHggatw3JiNVb7y0)  
[development.pu](development.pu) to <http://www.plantuml.com/plantuml/uml/>

## DocumentationJS

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

- [\_package][1]
- [homeName][2]
- [home][3]
- [parser][4]
- [args][5]
- [sequelize][6]
- [getTwFF][7]
- [legacyTwYes][8]
  - [Parameters][9]
- [useThisLinkClick][10]
  - [Parameters][11]
- [legacyTwYesAndUseThisLinkClick][12]
  - [Parameters][13]
- [countOfCalledFinishSequence][14]
- [finishSequence][15]
- [scroll][16]
  - [Parameters][17]
- [newFOrFPage][18]
  - [Parameters][19]

### \_package

**Meta**

- **version**: 1.0.0
- **author**: Motone Adachi (waritocomatta)

### homeName

for multi platform.

Type: homeNameType

### home

this is path.

Type: [string][20]

### parser

by <code>new ArgumentParser</code>

Type: [Object][21]

### args

by Argument (string | number)

Type: [Object][21]&lt;[string][20]>

### sequelize

by <code>new Sequelize</code>

Type: [Object][21]

### getTwFF

this is sequelize model.

Type: [Object][21]

### legacyTwYes

this function accept legacy tw.

#### Parameters

- `page` **[Object][21]** by browser by puppeteer.

### useThisLinkClick

this function click link of "use this" in page.

#### Parameters

- `page` **[Object][21]** by browser by puppeteer.

### legacyTwYesAndUseThisLinkClick

- **See: legacyTwYes**
- **See: useThisLinkClick**

This function call legacyTwYes and useThisLinkClick.

#### Parameters

- `page`  
- `browser` **[Object][21]** by puppeteer
- `fOrF` **fOrFType** 'following' or 'followers'

### countOfCalledFinishSequence

count of called finish sequence.

Type: [number][22]

### finishSequence

this function exit this system<br>
when two called.

### scroll

- **See: finishSequence**

this function get info of following and followers.<br>
and, save it to database.
and, move to next page.
if moved page is last page, call finishSequence

#### Parameters

- `page` **[Object][21]** by browser by puppeteer.
- `fOrF` **fOrFType** 'following' or 'followers'

### newFOrFPage

- **See: legacyTwYesAndUseThisLinkClick**
- **See: scroll**

this function create new pages of followers list or followings list.<br>
this function call legacyTwYesAndUseThisLinkClick function.<br>
because, twitter show pages of some confirm.<br>
after that, call scroll function.

#### Parameters

- `browser` **[Object][21]** by puppeteer
- `fOrF` **fOrFType** 'following' or 'followers'

[1]: #_package

[2]: #homename

[3]: #home

[4]: #parser

[5]: #args

[6]: #sequelize

[7]: #gettwff

[8]: #legacytwyes

[9]: #parameters

[10]: #usethislinkclick

[11]: #parameters-1

[12]: #legacytwyesandusethislinkclick

[13]: #parameters-2

[14]: #countofcalledfinishsequence

[15]: #finishsequence

[16]: #scroll

[17]: #parameters-3

[18]: #newforfpage

[19]: #parameters-4

[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[21]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[22]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
