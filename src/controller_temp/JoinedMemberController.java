package controller;

import java.io.IOException;
import java.io.Reader;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.ibatis.common.resources.Resources;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.JoinedMemberVO;

public class JoinedMemberController 
{
	private	GenericService<JoinedMemberVO>	genericService;
	
	public JoinedMemberController()
	{
		genericService = new GenericServiceImpl<JoinedMemberVO>();
	}

	public GenericService<JoinedMemberVO> getGenericService() 
	{
		return genericService;
	}

	public void setGenericService(GenericService<JoinedMemberVO> genericService) 
	{
		this.genericService = genericService;
	}
	
	public void add(String mapper, JoinedMemberVO joinedMemberVO)	throws RuntimeException
	{
		genericService.add(mapper, joinedMemberVO);
	}
	
	public void modify(String mapper, JoinedMemberVO joinedMemberVO)	throws RuntimeException
	{
		genericService.modify(mapper, joinedMemberVO);
	}
	
	public JoinedMemberVO search(String mapper, String id)	throws RuntimeException
	{
		return genericService.search(mapper, id);
	}
	
	public List<JoinedMemberVO> searchAll(String mapper)	throws RuntimeException
	{
		return genericService.searchAll(mapper);
	}
	
	public void delete(String mapper, String id)	throws RuntimeException
	{
		genericService.delete(mapper, id);
	}
	
	public List<JoinedMemberVO>	searchJoinedMember(String mapper, String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
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
		
		List<JoinedMemberVO>	list = sqlSession.selectList(mapper, id);
		
		sqlSession.close();
		
		return list;
	}
}
