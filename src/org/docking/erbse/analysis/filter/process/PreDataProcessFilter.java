package org.docking.erbse.analysis.filter.process;

import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;

public abstract class PreDataProcessFilter extends DataProcessFilter {

	public PreDataProcessFilter(DockingAnalyzer stream) {
		super(stream);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected byte[] process(byte[] data, List<Integer> startWidth,
			List<Integer> endWidth) {
		// TODO Auto-generated method stub
		return null;
	}

}
