package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DockingAddressChangeFilter extends DataConversionFilter {

	/*
	 * 경로 바꿀거 생각중..
	 */
	public DockingAddressChangeFilter(DockingAnalyzer stream) {
		super(stream,new byte[][]{"./".getBytes()},new byte[][]{"./getData?value=".getBytes()});
		// TODO Auto-generated constructor stub
	}
	
	private void test(){
		
	}
}