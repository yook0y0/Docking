package org.docking.erbse.analysis.filter.processImpl;

import org.docking.erbse.analysis.DockingStream;
import org.docking.erbse.analysis.filter.process.SingleDataProcessFilter;

public class SingleDataDeleteFilter extends SingleDataProcessFilter {

	public SingleDataDeleteFilter(DockingStream stream, byte[][] targetData) {
		super(stream, targetData);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected byte[] operate(byte[] data, int dataIndex, int srcIndex) {
		// TODO Auto-generated method stub
		/*
		 * 구현필요
		 */
		return null;
	}

}
