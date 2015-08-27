/**
 * @author Andreas Bresser
 */

/**
 * a simple dialog with a email and password text input
 */
var LoginDialog = function() {
    GOWN.Control.call(this);
    // background
    this.bg = new GOWN.Rect(0x515151, 0.7, 200, 350, 5);
    this.addChild(this.bg);

    this.login_bg = new GOWN.Rect(0x111111, 0.5, 200, 100, 5);
    this.login_bg.y = 250;
    this.addChild(this.login_bg);

    // minimum width in Pixel
    this.minWidth = 200;
    // maximum width
    this.maxWidth = 380;

    this.height = 380;

    var grp = new GOWN.LayoutGroup();
    this.grp = grp;
    grp.layout = new GOWN.VerticalLayout();
    grp.y = 20;
    grp.x = 10;

    grp.layout.gap = 3;
    this.addChild(grp);

    this.loginText = new PIXI.Text('Login to your account', {
        fill: '#ffffff',
        font: 'bold 14px Arial'
    });
    grp.addChild(this.loginText);


    this.mailText = new PIXI.Text('Email', {
        fill: '#cccccc',
        font: '12px Arial'
    });
    grp.addChild(this.mailText);

    var user_icon = new PIXI.Text('\uf007', {
        fill: '#ffffff',
        font: '12px fontawesome'
    });
    this.mail = new IconTextInput(user_icon, '');
    grp.addChild(this.mail);

    grp.addSpacer(10);

    this.passText = new PIXI.Text('Password', {
        fill: '#cccccc',
        font: '12px Arial'
    });
    grp.addChild(this.passText);

    var lock_icon = new PIXI.Text('\uf023', {
        fill: '#ffffff',
        font: '12px fontawesome'
    });
    this.pass = new IconTextInput(lock_icon, '', true);
    grp.addChild(this.pass);

    this.submitButton = new GOWN.Button();
    this.submitButton.label = "sign in";
    this.submitButton.width = 150;
    this.submitButton.height = 40;
    this.addChild(this.submitButton);

};

LoginDialog.prototype = Object.create( GOWN.Control.prototype );
LoginDialog.prototype.constructor = LoginDialog;

/**
 * browser window gets resized
 * @param width
 * @param height
 */
LoginDialog.prototype.onresize = function(width, height) {
    var _width = Math.min(width, this.minWidth);
    _width = Math.max(_width, this.maxWidth);
    this.width = _width;
    var pos = GOWN.utils.position;
    // center text
    pos.centerHorizontal(this.loginText, this);
    // center
    pos.center(this);

    pos.center(this.submitButton, this.login_bg);

    this.submitButton.y += this.login_bg.y;
    // obey borders
    this.x = Math.max(this.x, 0);
    this.y = Math.max(this.y, 0);
};

// setter/getter
/**
 * The width of the dialog
 *
 * @property width
 * @type Number
 */
Object.defineProperty(LoginDialog.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this.bg.width = width;
        this.login_bg.width = width;
        this._width = width;
    }
});

/**
 * The height of the dialog
 *
 * @property height
 * @type Number
 */
Object.defineProperty(LoginDialog.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this.bg.height = height;
        // show login background at bottom
        this.login_bg.y = height - this.login_bg.height;
        this._height = height;
    }
});