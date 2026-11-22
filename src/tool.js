/*! Eretek Online Araçlar #48 — VM CPU ve RAM Kapasite Planlayıcı */
ERT.def('48', {
	run: function (v, c) {
		var vc = 0, ram = 0, rows = [];
		c.lines(v.vms, 2000, 'vms').forEach(function (l, i) {
			var p = l.split(/[;\t]/).map(function (x) { return x.trim(); }), cpu = ERT.parseNum(p[1], 'en'), r = ERT.parseNum(p[2], 'en'), k = p[3] ? ERT.parseNum(p[3], 'en') : 1;
			if (!(cpu > 0) || !(r > 0) || !(k > 0) || Math.floor(k) !== k) { throw c.fe('vms', 'rowFmt', { r: i + 1 }); }
			vc += cpu * k; ram += r * k; rows.push([p[0], cpu, r, k, cpu * k, r * k]);
		});
		var hostRam = v.ram - (v.resv || 0), freeRam = hostRam - ram, vcap = v.cores * v.ratio, freeV = vcap - vc, ratio = vc / v.cores;
		var msgs = [freeRam >= 0 ? ['ok', c.t('ramOk', { f: c.n(freeRam, 1) })] : ['err', c.t('ramBad', { f: c.n(-freeRam, 1) })], freeV >= 0 ? ['ok', c.t('cpuOk', { f: c.n(freeV, 1) })] : ['warn', c.t('cpuBad', { r: c.n(ratio, 2), t: c.n(v.ratio, 2) })], ['info', c.t('sep')]];
		var cols = ['VM', 'vCPU', 'RAM GiB', c.t('c_cnt'), c.t('c_tv'), c.t('c_tr')];
		return { big: c.t('big', { r: c.n(freeRam, 1), v: c.n(freeV, 1) }), kv: [[c.t('ramAvail'), c.n(hostRam, 1) + ' GiB'], [c.t('ramUsed'), c.n(ram, 1) + ' GiB'], [c.t('ramFree'), c.n(freeRam, 1) + ' GiB'], [c.t('vcap'), c.n(vcap, 1) + ' vCPU (' + v.cores + ' × ' + c.n(v.ratio, 2) + ')'], [c.t('vused'), c.n(vc, 0) + ' vCPU'], [c.t('ratioNow'), c.n(ratio, 2) + ':1']], msgs: msgs, tables: [{ cols: cols, rows: rows }], v: { freeRam: Math.round(freeRam * 1000) / 1000, freeV: Math.round(freeV * 1000) / 1000 } };
	}
});
