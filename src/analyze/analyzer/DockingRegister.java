package analyze.analyzer;

import analyze.attribute.DockingAttrSet;

public abstract class DockingRegister extends DockingAttrSet{
	
	private String srcPath;
	
	public DockingRegister(String srcPath) {
		super();
		this.srcPath = srcPath;
	}
	
	public String getSrcPath() {
		return srcPath;
	}

	public void setSrcPath(String srcPath) {
		this.srcPath = srcPath;
	}
}
