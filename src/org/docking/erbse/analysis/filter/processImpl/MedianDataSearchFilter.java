package org.docking.erbse.analysis.filter.processImpl;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.filter.process.MedianDataProcessFilter;

public class MedianDataSearchFilter extends MedianDataProcessFilter {

	public MedianDataSearchFilter(DockingAnalyzer stream, byte[][] preData,
			byte[][] postData) {
		super(stream, preData, postData);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected byte[] operate(byte[] data, int dataIndex, int srcIndex,
			int targetIndex) {
		// TODO Auto-generated method stub
		return data;
	}
}
