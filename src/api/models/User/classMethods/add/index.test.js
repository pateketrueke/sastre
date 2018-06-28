const Container = require('../../../../../../lib/container');

const $ = new Container(process.cwd());

const User = $.getModel('User');

const td = require('testdouble');

require('chai').should();

describe('User', () => {
  describe('#add', () => {
    let createCallback;
    let saveCallback;

    let IF_OK;

    beforeEach(() => {
      createCallback = td.func('User.create');
      saveCallback = td.func('user.save');

      IF_OK = Symbol('IT_SHALL_NOT_PASS');
    });

    afterEach(() => {
      td.reset();
    });

    it('can mock User.create as expected', async () => {
      const input = {
        some: 'INFO',
      };

      td.when(saveCallback()).thenReturn(IF_OK);

      td.replace(User, 'create', createCallback);
      td.when(User.create(input)).thenReturn({ save: saveCallback });

      const result = await User.classMethods.add(input);

      result.should.be.eql(IF_OK);
    });

    it('can mock through DI as expected', async () => {
      const { classMethods } = $.models.registry.User;

      const Token = $.getModel('Token');

      const UserMock = td.imitate(User);
      const TokenMock = td.imitate(Token);

      const input = {
        foo: 'BAR',
      };

      td.when(saveCallback()).thenReturn(IF_OK);
      td.when(UserMock.create(input)).thenReturn({ save: saveCallback });

      const add = classMethods.add.factory({ User: UserMock, Token: TokenMock });

      const result = await add(input);

      result.should.be.eql(IF_OK);
    });
  });
});