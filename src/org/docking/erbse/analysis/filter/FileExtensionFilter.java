package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;

public class FileExtensionFilter extends TokenDivisionFilter {

	public FileExtensionFilter(DockingAnalyzer stream) 
	{
		super(stream,new String[]{"."});
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		super.analyze();
	}
}
