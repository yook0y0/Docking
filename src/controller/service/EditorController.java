package controller.service;

import java.io.IOException;
import java.io.Reader;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.ibatis.common.resources.Resources;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.EditorVO;

public class EditorController 
{
	private	GenericService<EditorVO>	genericService;
	
	public EditorController()
	{
		genericService = new GenericServiceImpl<EditorVO>();
	}

	public GenericService<EditorVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<EditorVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, EditorVO editorCodeVO)	throws RuntimeException
	{
		genericService.add(mapper, editorCodeVO);
	}
	
	public void modify(String mapper, EditorVO editorCodeVO)	throws RuntimeException
	{
		genericService.modify(mapper, editorCodeVO);
	}
	
	public EditorVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<EditorVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
	
	SqlSession	sqlSession = null;
	
	public void	tempConnect()
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
			
					System.out.println("Session Connect....");
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}
	
	public void tempAdd(String mapper, EditorVO editorVO)
	{
		sqlSession.selectList(mapper, editorVO);
	}
	
	public void tempDisConnect()
	{
		sqlSession.close();
	}
}
