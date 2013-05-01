var utils = (function utils() {});

utils.sum = function (arr) {
	return arr.reduce( function(a, b) { return a + b; } );
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
	var m1 = numeric.transpose(mat.map(utils.center));
	return utils.dot(utils.SVD(m1).V, mat);
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