package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DataSearchFilter extends DataProcessFilter {

	public DataSearchFilter(DockingAnalyzer stream, byte[][] preData,
			byte[][] postData) {
		super(stream, preData, postData);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected byte[] process(byte[] data, int dataIndex, int srcIndex,
			int targetIndex) {
		// TODO Auto-generated method stub
		return data;
	}
}
