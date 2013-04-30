var utils.sum = function (arr) {
	return arr.reduce( function(a, b) { return a + b; } );
}

var utils.mean = function (arr) {
	return utils.sum(arr)/arr.length;
}

var utils.center = function (arr) {
	m = utils.mean(arr);
	return arr.map( function (x) { return x-m } );
}

var utils.dot = numeric.dot;

var utils.covariance = function(arr1, arr2) {
	if (arr1.length === arr2.length) {
		a1 = utils.center(arr1);
		a2 = utils.center(arr2);
		return utils.dot(a1,a2);
	} else {
		throw new Error('Array mismatch');
	}
}

var utils.variance = function (arr) {
	return utils.covariance(arr,arr);
}

var util.stdErr = function (arr) {
	return Math.sqrt(utils.variance(arr));
}

var utils.covarAM = function (arr, mat) {
	return mat.map( function (x) {
		return covariance(arr, x);
	});
}

var utils.covMatrix = function (mat) {
	return mat.map( function (a, index) {
		return covarAM(a, mat);
	});
}

var utils.SVD = numeric.svd;

var utils.PCA = function (mat) {
	m1 = mat.map(utils.center);
	return utils.dot(numeric.transpose(utils.SVD(m1).U), mat);
}

var utils.spectrum = function (arr) {
	return (new numeric.T(arr)).fft().map( function (z) { return z.norm2 } );
}

var utils.max = function (arr) {
	return Math.max.apply(null, arr);
}