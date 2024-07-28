'use strict';

class Package {
    constructor() {
        this.packageName = 'package';
        console.log('Package constructor', this.packageName);
    }
}

module.exports = Package;
