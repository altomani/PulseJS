var utils = (function utils() {});

utils.sum = function (arr) {
	var s = arr.reduce( function(a, b) { return a + b; } );
	return s;
}

utils.mean = function (arr) {
	return utils.sum(arr)/arr.length;
}

utils.center = function (arr) {
	var m = utils.mean(arr);
	return arr.map( function (x) { return x-m } );
}

utils.dot = numeric.dot;

utils.covariance = function(arr1, arr2) {
	if (arr1.length === arr2.length) {
		var a1 = utils.center(arr1);
		var a2 = utils.center(arr2);
		return utils.dot(a1,a2);
	} else {
		throw new Error('Array mismatch');
	}
}

utils.variance = function (arr) {
	return utils.covariance(arr,arr);
}

utils.stdErr = function (arr) {
	return Math.sqrt(utils.variance(arr));
}

utils.normalize =function (arr) {
	var s = utils.stdErr(arr);
	return utils.center(arr).map( function (x) { return (x / s) } );
}

utils.covarAM = function (arr, mat) {
	return mat.map( function (x) {
		return covariance(arr, x);
	});
}

utils.covMatrix = function (mat) {
	return mat.map( function (a, index) {
		return covarAM(a, mat);
	});
}

utils.SVD = numeric.svd;

utils.PCA = function (mat) {
	return numeric.transpose(utils.SVD(numeric.transpose(mat)).U);
}

utils.spectrum = function (arr) {
	var a1 = new numeric.T(arr);
	var f = a1.fft()
	return numeric.add(numeric.mul(f.x,f.x), numeric.mul(f.y,f.y));
}

utils.max = function (arr) {
	return Math.max.apply(null, arr);
}

utils.addIndex = function (arr) {
	return arr.map(function (x, i) { return [i,x]; });
}

utils.range = function (n) {
	var i, a = [];
	for (i = 0; i < n; i++) {
		a.push(i);
	}
	return a;
}

utils.delinearize = function (arr) {
	var l=arr.length, r=utils.range(l), 
	 	beta = utils.covariance(arr, r)/utils.variance(r),
	 	alpha = utils.mean(arr) - beta * utils.mean(r);
	return arr.map(function(x, i) { return x-alpha-beta*i})
}