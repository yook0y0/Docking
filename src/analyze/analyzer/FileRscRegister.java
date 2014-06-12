package analyze.analyzer;

import analyze.attribute.AttributeDataType;

public class FileRscRegister extends DockingRegister {

	public FileRscRegister(String srcPath) {
		super(srcPath);
		try {
			this.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		String srcPath = this.getSrcPath();
		
		this.getAttrSet().put(AttributeDataType.FILE_RESOURCE_PATH, srcPath);
	}
}
