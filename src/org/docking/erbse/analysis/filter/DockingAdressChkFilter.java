package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DockingAdressChkFilter extends DataConversionFilter {

	public DockingAdressChkFilter(DockingAnalyzer stream) {
		super(stream,new byte[][]{"./".getBytes()},new byte[][]{"./getData?value=".getBytes()});
		// TODO Auto-generated constructor stub
	}
}